import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchConversation = createAsyncThunk(
  'chatbot/fetchConversation',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/chatbot/conversation`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch conversation');
      }

      return data.messages;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async (message, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/chatbot/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearConversation = createAsyncThunk(
  'chatbot/clearConversation',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/chatbot/conversation`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to clear conversation');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateHint = createAsyncThunk(
  'chatbot/generateHint',
  async (photoDescription, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/chatbot/hint`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoDescription }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate hint');
      }

      return data.hint;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  messages: [],
  loading: false,
  error: null,
  hint: null,
  hintLoading: false,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearHint: (state) => {
      state.hint = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversation
      .addCase(fetchConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.conversation;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear conversation
      .addCase(clearConversation.fulfilled, (state) => {
        state.messages = [];
        state.error = null;
      })
      // Generate hint
      .addCase(generateHint.pending, (state) => {
        state.hintLoading = true;
        state.error = null;
      })
      .addCase(generateHint.fulfilled, (state, action) => {
        state.hintLoading = false;
        state.hint = action.payload;
      })
      .addCase(generateHint.rejected, (state, action) => {
        state.hintLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearHint } = chatbotSlice.actions;
export default chatbotSlice.reducer; 