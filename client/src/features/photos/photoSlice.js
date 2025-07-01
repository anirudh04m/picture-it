import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Helper function to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Async thunks
export const uploadPhoto = createAsyncThunk(
  'photos/uploadPhoto',
  async (photoData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', photoData.image);
      formData.append('title', photoData.title || photoData.location);
      formData.append('description', photoData.description || '');
      formData.append('difficulty', photoData.difficulty);
      
      // Parse location into country and city
      const locationParts = photoData.location.split(',').map(part => part.trim());
      const city = locationParts[0] || '';
      const country = locationParts[1] || locationParts[0] || '';
      
      formData.append('actualLocation[country]', country);
      formData.append('actualLocation[city]', city);

      const response = await axios.post(`${API_BASE_URL}/api/photos/upload`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Upload failed');
    }
  }
);

export const fetchPhotos = createAsyncThunk(
  'photos/fetchPhotos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/photos`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch photos');
    }
  }
);

export const fetchMyPhotos = createAsyncThunk(
  'photos/fetchMyPhotos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/photos/my-photos`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your photos');
    }
  }
);

const initialState = {
  photos: [],
  myPhotos: [],
  loading: false,
  uploadLoading: false,
  error: null,
};

const photoSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPhotos: (state) => {
      state.photos = [];
      state.myPhotos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload photo
      .addCase(uploadPhoto.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.myPhotos.unshift(action.payload);
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload;
      })
      // Fetch photos
      .addCase(fetchPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.photos = action.payload;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch my photos
      .addCase(fetchMyPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.myPhotos = action.payload;
      })
      .addCase(fetchMyPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearPhotos } = photoSlice.actions;
export default photoSlice.reducer; 