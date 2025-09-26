import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';

const ChatInput = ({ onSendMessage, disabled = false, placeholder = "Type your message..." }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = () => {
    if (inputText.trim() && !disabled && onSendMessage) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex space-x-2 items-end">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 border border-purple-200 dark:border-purple-700 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-gray-900 dark:text-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 resize-none max-h-32 min-h-[48px] disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
        style={{ 
          lineHeight: '1.5',
          minHeight: '48px',
          maxHeight: '128px'
        }}
      />
      
      <button
        onClick={handleSubmit}
        disabled={disabled || !inputText.trim()}
        className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white p-3 rounded-full hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 min-w-[48px] h-12 shadow-md"
        title="Send message"
      >
        {disabled ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default ChatInput;