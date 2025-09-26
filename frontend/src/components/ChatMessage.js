import React, { useEffect, useRef, useState } from 'react';
import { User, Clock } from 'lucide-react';
import RobotAvatar from './RobotAvatar';

const ChatMessage = ({ message, isLoading = false }) => {
  const messageRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const isUser = message?.type === 'user';
  const timestamp = message?.timestamp || new Date();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-start">
        <div className="flex max-w-3xl items-start">
          <div className="flex-shrink-0 mr-3">
            <RobotAvatar isThinking={true} size={40} />
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl rounded-bl-none p-4 shadow-md border border-white/40 dark:border-slate-700/40 transition-colors duration-200">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{animationDelay: '150ms'}} />
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '300ms'}} />
              </div>
              <span className="text-gray-600 dark:text-gray-300">AI is thinking...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!message) return null;

  return (
    <div
      ref={messageRef}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className={`flex max-w-[70%] lg:max-w-3xl items-start ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}>
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          {isUser ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg transition-transform hover:scale-110">
              <User className="w-5 h-5 text-white" />
            </div>
          ) : (
            <RobotAvatar isThinking={false} size={40} />
          )}
        </div>
        
        <div className={`group relative rounded-2xl p-4 transition-all duration-300 hover:shadow-xl ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white rounded-br-none' 
            : 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-gray-900 dark:text-gray-100 rounded-bl-none shadow-md border border-white/40 dark:border-slate-700/40'
        }`}>
          <div className="relative z-10 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
          
          {/* Original Japanese text if available */}
          {message.originalJapanese && (
            <div className={`mt-2 pt-2 border-t ${
              isUser ? 'border-blue-400/30' : 'border-gray-200 dark:border-gray-700'
            }`}>
              <p className={`text-xs italic ${
                isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
                🇯🇵 Original: "{message.originalJapanese}"
              </p>
            </div>
          )}
          
          <div className={`flex items-center mt-2 text-xs ${
            isUser ? 'text-blue-100 dark:text-blue-200' : 'text-gray-500 dark:text-gray-400'
          }`}>
            <Clock className="w-3 h-3 mr-1" />
            {timestamp.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;