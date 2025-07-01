import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage, 
  setCurrentChat,
  addMessage,
  clearUnreadCount
} from '../features/chat/chatSlice';
import { fetchUsers } from '../features/users/userSlice';
import socketService from '../services/socketService';
import { MessageCircle, Send, Search, User, Clock, ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { conversations, messages, currentChat, loading, unreadCount } = useSelector((state) => state.chat);
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    if (user) {
      console.log('Chat: User authenticated, fetching data...', user);
      dispatch(fetchConversations());
      dispatch(fetchUsers());
      
      // Connect to socket
      const token = localStorage.getItem('token');
      console.log('Chat: Connecting to socket with token:', token ? 'Token exists' : 'No token');
      socketService.connect(token);
      socketService.authenticate(user._id);

      // Set up socket listeners
      socketService.onNewMessage((data) => {
        console.log('Chat: Received new message:', data);
        dispatch(addMessage({ ...data, currentUserId: user._id }));
        if (data.sender._id !== user._id) {
          toast.success(`New message from ${data.sender.username}`);
        }
      });

      return () => {
        socketService.removeAllListeners();
        socketService.disconnect();
      };
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (currentChat) {
      console.log('Chat: Fetching messages for user:', currentChat);
      dispatch(fetchMessages(currentChat));
    }
  }, [dispatch, currentChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages[currentChat]]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentChat) return;

    try {
      await dispatch(sendMessage({ recipientId: currentChat, content: message })).unwrap();
      
      // Send via socket for real-time
      socketService.sendMessage({
        recipientId: currentChat,
        content: message,
        sender: user,
        timestamp: new Date()
      });

      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleConversationClick = (userId) => {
    dispatch(setCurrentChat(userId));
    setShowNewChat(false);
    
    // Clear unread count for this conversation
    dispatch(clearUnreadCount(userId));
  };

  const handleNewChat = (selectedUserId) => {
    dispatch(setCurrentChat(selectedUserId));
    setSelectedUser(null);
    setShowNewChat(false);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u._id !== user?._id && 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !conversations.find(conv => conv.user._id === u._id)
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentMessages = messages[currentChat] || [];
  const currentConversation = conversations.find(conv => conv.user._id === currentChat);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Please log in to access chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-100px)]">
      <div className="bg-white rounded-lg shadow-md h-full flex">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            {showNewChat ? (
              // New Chat Header
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowNewChat(false)}
                    className="mr-3 p-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">New Conversation</h2>
                </div>
              </div>
            ) : (
              // Regular Header
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                <button
                  onClick={() => setShowNewChat(true)}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  title="Start new conversation"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            )}
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={showNewChat ? "Search users..." : "Search conversations..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {showNewChat ? (
              // New Chat View
              <div className="p-4">
                {filteredUsers.map((userItem) => (
                  <div
                    key={userItem._id}
                    onClick={() => handleNewChat(userItem._id)}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{userItem.username}</p>
                      <p className="text-sm text-gray-500">Start a conversation</p>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <User className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">No users found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                  </div>
                )}
              </div>
            ) : (
              // Conversations List
              <div>
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.user._id}
                    onClick={() => handleConversationClick(conversation.user._id)}
                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      currentChat === conversation.user._id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                    }`}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <MessageCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {conversation.user.username}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                ))}
                {filteredConversations.length === 0 && (
                  <div className="p-4 text-center">
                    <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">No conversations yet</p>
                    <button
                      onClick={() => setShowNewChat(true)}
                      className="mt-2 text-blue-600 hover:text-blue-700"
                    >
                      Start a conversation
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {currentChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {currentConversation?.user.username}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    {currentMessages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'} mb-3`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                            msg.sender._id === user._id
                              ? 'bg-blue-500 text-white rounded-br-md'
                              : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <div className={`flex items-center mt-2 text-xs ${
                            msg.sender._id === user._id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || loading}
                    className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            // No chat selected
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat; 