import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Async thunks
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Chat API: Fetching conversations with token:', token ? 'Token exists' : 'No token');
      const response = await axios.get(`${API_BASE_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Chat API: Conversations response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Chat API: Error fetching conversations:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Chat API: Fetching messages for user:', userId);
      const response = await axios.get(`${API_BASE_URL}/chat/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Chat API: Messages response:', response.data);
      return { userId, messages: response.data };
    } catch (error) {
      console.error('Chat API: Error fetching messages:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ recipientId, content }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Chat API: Sending message to:', recipientId, 'Content:', content);
      const response = await axios.post(`${API_BASE_URL}/chat/messages`, {
        recipientId,
        content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Chat API: Send message response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Chat API: Error sending message:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  'chat/markMessageAsRead',
  async (messageId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/chat/messages/${messageId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark message as read');
    }
  }
);

const initialState = {
  conversations: [],
  messages: {},
  currentChat: null,
  loading: false,
  error: null,
  unreadCount: 0
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const currentUserId = message.currentUserId;
      console.log('Chat slice: Adding message:', {
        messageId: message._id,
        senderId: message.sender._id,
        recipientId: message.recipient._id,
        currentUserId: currentUserId,
        currentChat: state.currentChat,
        content: message.content
      });
      
      // Determine the conversation ID (the other user in the conversation)
      // This should be the user we're chatting with, not the current user
      let conversationId;
      if (message.sender._id === currentUserId) {
        // If current user is the sender, conversation is with recipient
        conversationId = message.recipient._id;
      } else if (message.recipient._id === currentUserId) {
        // If current user is the recipient, conversation is with sender
        conversationId = message.sender._id;
      } else {
        // Fallback: use the other user's ID
        conversationId = message.sender._id === currentUserId ? message.recipient._id : message.sender._id;
      }
      
      console.log('Chat slice: Conversation ID determined:', conversationId);
      
      // Add message to messages
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
      
      // Update conversation
      const conversationIndex = state.conversations.findIndex(
        conv => conv.user._id === conversationId
      );
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = message;
        // Only increment unread count if the message is from the other user (not from current user)
        if (message.sender._id !== currentUserId) {
          state.conversations[conversationIndex].unreadCount += 1;
          state.unreadCount += 1;
        }
      } else {
        // If conversation doesn't exist, we might need to fetch conversations again
        console.log('Chat slice: Conversation not found, might need to refresh conversations');
      }
    },
    updateTypingStatus: (state, action) => {
      // Handle typing indicators
      const { userId, isTyping } = action.payload;
      // You can add typing state here if needed
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUnreadCount: (state, action) => {
      const conversationId = action.payload;
      const conversationIndex = state.conversations.findIndex(
        conv => conv.user._id === conversationId
      );
      
      if (conversationIndex !== -1) {
        const oldUnreadCount = state.conversations[conversationIndex].unreadCount;
        state.conversations[conversationIndex].unreadCount = 0;
        state.unreadCount -= oldUnreadCount;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
        state.unreadCount = action.payload.reduce((total, conv) => total + conv.unreadCount, 0);
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, messages } = action.payload;
        state.messages[userId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        console.log('Chat slice: Send message fulfilled:', {
          messageId: message._id,
          senderId: message.sender._id,
          recipientId: message.recipient._id,
          currentChat: state.currentChat
        });
        
        // Store message under the recipient's ID (the user we're chatting with)
        const conversationId = message.recipient._id;
        
        // Add message to messages
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(message);
        
        // Update conversation
        const conversationIndex = state.conversations.findIndex(
          conv => conv.user._id === conversationId
        );
        
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].lastMessage = message;
        }
      })
      
      // Mark message as read
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const updatedMessage = action.payload;
        // Update the message in the state
        Object.keys(state.messages).forEach(userId => {
          const messageIndex = state.messages[userId].findIndex(
            msg => msg._id === updatedMessage._id
          );
          if (messageIndex !== -1) {
            state.messages[userId][messageIndex] = updatedMessage;
          }
        });
      });
  }
});

export const { setCurrentChat, addMessage, updateTypingStatus, clearError, clearUnreadCount } = chatSlice.actions;
export default chatSlice.reducer; 