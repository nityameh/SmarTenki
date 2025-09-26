import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import { checkAPIHealth } from './services/chatAPI';
import './App.css';
import './styles/advanced.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [apiStatus, setApiStatus] = useState('checking');

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

    checkAPI();

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
      <LanguageProvider>
        <div className="App">
          {apiStatus !== 'connected' && (
            <div className={`api-status-bar ${apiStatus}`}>
              {apiStatus === 'checking' ? (
                <span>🔄 Connecting to server...</span>
              ) : (
                <span>⚠️ Server connection failed. Some features may not work.</span>
              )}
            </div>
          )}

          {currentView === 'home' ? (
            <HomePage onStartChat={handleStartChat} />
          ) : (
            <ChatPage onBackHome={handleBackHome} />
          )}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;