import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Camera, MapPin, Trophy, User, Upload, Home, LogOut, MessageCircle, Bot } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.chat);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
            <Camera className="h-8 w-8" />
            <span>Picture It</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/guess"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <MapPin className="h-5 w-5" />
              <span>Guess</span>
            </Link>
            <Link
              to="/upload"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Upload className="h-5 w-5" />
              <span>Upload</span>
            </Link>
            <Link
              to="/my-photos"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Camera className="h-5 w-5" />
              <span>My Photos</span>
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Trophy className="h-5 w-5" />
              <span>Leaderboard</span>
            </Link>
            <Link
              to="/chat"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors relative"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Chat</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <Link
              to="/ai-assistant"
              className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <Bot className="h-5 w-5" />
              <span>AI Assistant</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-gray-700 font-medium hidden sm:block">
                {user?.username}
              </span>
            </div>
            
            <Link
              to="/profile"
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              title="Profile"
            >
              <User className="h-5 w-5" />
            </Link>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-700 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4 border-t">
          <div className="grid grid-cols-5 gap-4">
            <Link
              to="/"
              className="flex flex-col items-center space-y-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
            <Link
              to="/guess"
              className="flex flex-col items-center space-y-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <MapPin className="h-5 w-5" />
              <span className="text-xs">Guess</span>
            </Link>
            <Link
              to="/upload"
              className="flex flex-col items-center space-y-1 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs">Upload</span>
            </Link>
            <Link
              to="/chat"
              className="flex flex-col items-center space-y-1 text-gray-700 hover:text-blue-600 transition-colors relative"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">Chat</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <Link
              to="/ai-assistant"
              className="flex flex-col items-center space-y-1 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <Bot className="h-5 w-5" />
              <span className="text-xs">AI</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 