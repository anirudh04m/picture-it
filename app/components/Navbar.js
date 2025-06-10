'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Trophy, User, Upload, Home, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Picture It</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            {user ? (
              <>
                <Link href="/guess" className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors">
                  <Camera className="h-4 w-4" />
                  <span>Guess</span>
                </Link>
                <Link href="/upload" className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Link>
                <Link href="/leaderboard" className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors">
                  <Trophy className="h-4 w-4" />
                  <span>Leaderboard</span>
                </Link>
              </>
            ) : null}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">{user.username}</span>
                  <span className="text-sm text-gray-500">({user.points} pts)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href="/profile" className="btn-secondary text-sm">
                    <User className="h-4 w-4" />
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary text-sm">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="btn-secondary text-sm">Login</Link>
                <Link href="/register" className="btn-primary text-sm">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              {user ? (
                <>
                  <Link href="/guess" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                    <Camera className="h-4 w-4" />
                    <span>Guess Location</span>
                  </Link>
                  <Link href="/upload" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                    <Upload className="h-4 w-4" />
                    <span>Upload Photo</span>
                  </Link>
                  <Link href="/leaderboard" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                    <Trophy className="h-4 w-4" />
                    <span>Leaderboard</span>
                  </Link>
                  <Link href="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/login" className="btn-secondary text-sm">Login</Link>
                  <Link href="/register" className="btn-primary text-sm">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 