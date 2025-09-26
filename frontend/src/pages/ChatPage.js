// src/pages/ChatPage.js
import React from 'react';
import ChatInterface from '../components/ChatInterface';

const ChatPage = ({ onBackHome }) => {
  return (
    <div className="h-screen">
      <ChatInterface onBackHome={onBackHome} />
    </div>
  );
};

export default ChatPage;