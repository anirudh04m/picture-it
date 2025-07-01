import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Helper function to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async thunks
export const submitGuess = createAsyncThunk(
  'guesses/submitGuess',
  async (guessData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/guesses`, guessData, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit guess');
    }
  }
);

export const fetchMyGuesses = createAsyncThunk(
  'guesses/fetchMyGuesses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/guesses/my-guesses`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch guesses');
    }
  }
);

const initialState = {
  myGuesses: [],
  loading: false,
  submitLoading: false,
  error: null,
  lastGuessResult: null,
};

const guessSlice = createSlice({
  name: 'guesses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLastGuessResult: (state) => {
      state.lastGuessResult = null;
    },
    clearGuesses: (state) => {
      state.myGuesses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit guess
      .addCase(submitGuess.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(submitGuess.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.lastGuessResult = action.payload;
        state.myGuesses.unshift(action.payload);
      })
      .addCase(submitGuess.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload;
      })
      // Fetch my guesses
      .addCase(fetchMyGuesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyGuesses.fulfilled, (state, action) => {
        state.loading = false;
        state.myGuesses = action.payload;
      })
      .addCase(fetchMyGuesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLastGuessResult, clearGuesses } = guessSlice.actions;
export default guessSlice.reducer; 