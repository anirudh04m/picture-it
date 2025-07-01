import React from 'react';
import Chat from '../components/Chat';

const ChatPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
        <p className="text-gray-600 mt-2">Connect with other players and discuss your favorite locations!</p>
      </div>
      <Chat />
    </div>
  );
};

export default ChatPage; 