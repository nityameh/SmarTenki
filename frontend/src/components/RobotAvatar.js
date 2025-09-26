import React from 'react';
import robotImage from '../assets/robot-avatar.png'; // Make sure to save your image here

const RobotAvatar = ({ isThinking = false, size = 40 }) => {
  return (
    <div className="relative">
      {/* Main avatar container */}
      <div 
        className={`relative rounded-xl overflow-hidden shadow-lg transition-transform duration-300 ${
          isThinking ? 'animate-float' : 'hover:scale-110'
        }`}
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)'
        }}
      >
        <img 
          src={robotImage} 
          alt="AI Assistant"
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay for better integration */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
      </div>
      
      {/* Thinking indicator */}
      {isThinking && (
        <>
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-xl">
            <div className="w-full h-full rounded-xl border-2 border-purple-400 animate-ping opacity-75" />
          </div>
          
          {/* Status dot */}
          <div className="absolute -top-1 -right-1">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
          </div>
          
          {/* Thinking dots below */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
          </div>
        </>
      )}
    </div>
  );
};

export default RobotAvatar;