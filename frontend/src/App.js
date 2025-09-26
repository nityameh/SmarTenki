// src/App.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import { checkAPIHealth } from './services/chatAPI';
import './App.css';
import './styles/advanced.css'; 
function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'chat'
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'

  // Check API connection on app start
  useEffect(() => {
    const checkAPI = async () => {
      try {
        await checkAPIHealth();
        setApiStatus('connected');
        console.log('✅ API connection successful');
      } catch (error) {
        setApiStatus('disconnected');
        console.error('❌ API connection failed:', error.message);
      }
    };

    // Initial check
    checkAPI();

    // Check every 30 seconds if disconnected
    const interval = setInterval(() => {
      if (apiStatus === 'disconnected') {
        checkAPI();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [apiStatus]);

  const handleStartChat = () => {
    setCurrentView('chat');
  };

  const handleBackHome = () => {
    setCurrentView('home');
  };

  return (
    <ThemeProvider>
      <div className="App">
        {/* API Status Indicator */}
        {apiStatus !== 'connected' && (
          <div className={`api-status-bar ${apiStatus}`}>
            {apiStatus === 'checking' ? (
              <span>🔄 Connecting to server...</span>
            ) : (
              <span>⚠️ Server connection failed. Some features may not work.</span>
            )}
          </div>
        )}

        {/* Main Content */}
        {currentView === 'home' ? (
          <HomePage onStartChat={handleStartChat} />
        ) : (
          <ChatPage onBackHome={handleBackHome} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;