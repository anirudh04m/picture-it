import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import photoReducer from '../features/photos/photoSlice';
import guessReducer from '../features/guesses/guessSlice';
import userReducer from '../features/users/userSlice';
import chatReducer from '../features/chat/chatSlice';
import chatbotReducer from '../features/chatbot/chatbotSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    photos: photoReducer,
    guesses: guessReducer,
    users: userReducer,
    chat: chatReducer,
    chatbot: chatbotReducer,
  },
}); 