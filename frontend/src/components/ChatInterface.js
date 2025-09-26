import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Home } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import VoiceInput from './VoiceInput';
import ThemeToggle from './ThemeToggle';
import { sendChatMessage } from '../services/chatAPI';

const ChatInterface = ({ onBackHome }) => {
  const [messages, setMessages] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Tokyo');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSendMessage = useCallback(async (text, isJapanese = false) => {
    if (!text.trim() || isLoading) return;

    console.log('[ChatInterface] Sending', { text, selectedCity, isJapanese });

    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: text,
      timestamp: new Date(),
      originalJapanese: isJapanese ? text : null,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text, selectedCity, isJapanese);

      if (response.success) {
        const data = response.data || {};
        console.log('[ChatInterface] Received response', {
          hasWeather: Boolean(data.weather),
          hasFollowUps: Array.isArray(data.followUpQuestions),
          city: data.currentCity
        });

        const mappedWeather = data.weather ? {
          city: data.weather.city,
          country: data.weather.country,
          current: data.weather.current ? {
            ...data.weather.current,
            city: data.weather.city,
            country: data.weather.country,
            temperature: data.weather.current.weather?.temperature,
            feelsLike: data.weather.current.weather?.feelsLike,
            description: data.weather.current.weather?.description,
            humidity: data.weather.current.weather?.humidity,
            windSpeed: data.weather.current.weather?.windSpeed,
            icon: data.weather.current.weather?.icon,
          } : null,
          forecast: data.weather.forecast
        } : null;

        const aiMessage = {
          id: `ai_${Date.now()}`,
          type: 'assistant',
          content: data.response,
          weather: mappedWeather,
          followUpQuestions: data.followUpQuestions,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('[ChatInterface] Chat error', error);
      const errorMessage = {
        id: `error_${Date.now()}`,
        type: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCity, isLoading]);

  const handleVoiceInput = useCallback((transcript) => {
    console.log('Voice transcript received:', transcript);
    if (transcript && transcript.trim()) {
      handleSendMessage(transcript, true);
    }
  }, [handleSendMessage]);

  useEffect(() => {
    const welcomeMessage = {
      id: 'welcome',
      type: 'assistant',
      content: `Welcome to your Japanese Weather Travel Assistant! 

I can help you with travel recommendations based on weather conditions in ${selectedCity}. 

You can speak in Japanese using the microphone or type your questions.`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 transition-colors duration-200">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900 opacity-90" />
        <div className="absolute inset-0 backdrop-blur-sm bg-white/10 dark:bg-black/10" />
        
        <div className="relative z-10 px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={onBackHome}
              className="flex items-center text-white/90 hover:text-white transition-colors group"
            >
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-medium">Home</span>
            </button>
            
            <h1 className="text-xl font-bold text-center flex-1 text-white tracking-wide">
              Weather Travel Assistant
            </h1>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 hover:bg-white/20 transition-colors">
                <MapPin className="w-4 h-4 mr-1.5 text-white/90" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-white border-0 text-sm focus:outline-none cursor-pointer font-medium"
                >
                  {['Tokyo', 'Osaka', 'Kyoto', 'Hiroshima', 'Sapporo', 'Fukuoka'].map(city => (
                    <option key={city} value={city} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800">
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 relative">
        {/* Floating gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900/30 rounded-full filter blur-[100px] opacity-30 animate-float" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-[100px] opacity-30 animate-float animation-delay-2000" />
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-[100px] opacity-30 animate-float animation-delay-4000" />
        </div>
        
        {/* Subtle dot pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Messages */}
        <div className="relative space-y-4 z-10">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && <ChatMessage isLoading={true} />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-4 shadow-lg transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-end space-x-2">
            <VoiceInput 
              onTranscript={handleVoiceInput}
              disabled={isLoading}
              language="ja-JP"
              compact={true}
            />
            
            <ChatInput
              onSendMessage={(text) => handleSendMessage(text, false)}
              disabled={isLoading}
              placeholder="Type your message or speak in Japanese..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;