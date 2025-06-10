'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Camera, 
  MapPin, 
  TrendingUp, 
  Award,
  Calendar,
  Mail,
  Shield
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || ''
      });
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const response = await axios.get('/api/users/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put('/api/users/profile', formData);
      updateUser(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      username: user.username || '',
      email: user.email || '',
      bio: user.bio || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="card">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-2xl">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <User className="h-4 w-4" />
                  <span>{user.username}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              ) : (
                <div className="flex items-center space-x-2 text-gray-900">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <div className="text-gray-900">
                {user.bio || 'No bio added yet.'}
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-secondary flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Points */}
            <div className="card text-center">
              <div className="flex items-center justify-center space-x-2 text-primary-600 mb-2">
                <TrendingUp className="h-6 w-6" />
                <span className="text-3xl font-bold">{stats.totalPoints}</span>
              </div>
              <p className="text-gray-600">Total Points</p>
            </div>

            {/* Correct Guesses */}
            <div className="card text-center">
              <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                <MapPin className="h-6 w-6" />
                <span className="text-3xl font-bold">{stats.correctGuesses}</span>
              </div>
              <p className="text-gray-600">Correct Guesses</p>
            </div>

            {/* Photos Uploaded */}
            <div className="card text-center">
              <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
                <Camera className="h-6 w-6" />
                <span className="text-3xl font-bold">{stats.photosUploaded}</span>
              </div>
              <p className="text-gray-600">Photos Uploaded</p>
            </div>

            {/* Total Guesses */}
            <div className="card text-center">
              <div className="flex items-center justify-center space-x-2 text-purple-600 mb-2">
                <Award className="h-6 w-6" />
                <span className="text-3xl font-bold">{stats.totalGuesses}</span>
              </div>
              <p className="text-gray-600">Total Guesses</p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stats.totalGuesses > 0 
                    ? Math.round((stats.correctGuesses / stats.totalGuesses) * 100)
                    : 0}%
                </div>
                <p className="text-gray-600">Correct guesses</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Points</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stats.totalGuesses > 0 
                    ? Math.round(stats.totalPoints / stats.totalGuesses)
                    : 0}
                </div>
                <p className="text-gray-600">Per guess</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stats.photosUploaded > 0 
                    ? (stats.totalGuesses / stats.photosUploaded).toFixed(1)
                    : 0}
                </div>
                <p className="text-gray-600">Guesses per photo</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/upload')}
            className="card hover:shadow-lg transition-shadow cursor-pointer text-center"
          >
            <Camera className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Upload Photo</h3>
            <p className="text-sm text-gray-600">Share a new location</p>
          </button>

          <button
            onClick={() => router.push('/guess')}
            className="card hover:shadow-lg transition-shadow cursor-pointer text-center"
          >
            <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Guess Location</h3>
            <p className="text-sm text-gray-600">Test your knowledge</p>
          </button>

          <button
            onClick={() => router.push('/my-photos')}
            className="card hover:shadow-lg transition-shadow cursor-pointer text-center"
          >
            <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">My Photos</h3>
            <p className="text-sm text-gray-600">Manage your uploads</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 