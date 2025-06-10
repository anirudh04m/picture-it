'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trophy, Medal, Award, TrendingUp, Camera, MapPin, Users } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // all, week, month

  useEffect(() => {
    loadLeaderboard();
  }, [timeFilter]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/leaderboard?time=${timeFilter}`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Leaderboard
        </h1>
        <p className="text-gray-600 mb-6">
          Top players based on points earned from correct guesses
        </p>
        
        {/* Time Filter */}
        <div className="flex justify-center space-x-2 mb-6">
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeFilter('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeFilter === 'month'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeFilter('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeFilter === 'week'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Rankings Yet</h2>
          <p className="text-gray-600">Start playing to see the leaderboard!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaderboard.map((user, index) => (
            <div
              key={user._id}
              className={`card hover:shadow-lg transition-all duration-200 ${
                index < 3 ? 'ring-2 ring-primary-200' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12">
                    {getRankIcon(index + 1)}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.username}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Member since {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-primary-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-2xl font-bold">{user.points}</span>
                    </div>
                    <p className="text-xs text-gray-500">Total Points</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-green-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-lg font-semibold">{user.correctGuesses}</span>
                    </div>
                    <p className="text-xs text-gray-500">Correct Guesses</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-blue-600">
                      <Camera className="h-4 w-4" />
                      <span className="text-lg font-semibold">{user.photosUploaded}</span>
                    </div>
                    <p className="text-xs text-gray-500">Photos Uploaded</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-purple-600">
                      <Users className="h-4 w-4" />
                      <span className="text-lg font-semibold">{user.totalGuesses}</span>
                    </div>
                    <p className="text-xs text-gray-500">Total Guesses</p>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRankBadge(index + 1)}`}>
                      Rank #{index + 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <span className="text-gray-500">Success Rate:</span>
                    <div className="font-semibold text-green-600">
                      {user.totalGuesses > 0 
                        ? Math.round((user.correctGuesses / user.totalGuesses) * 100)
                        : 0}%
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500">Avg Points/Guess:</span>
                    <div className="font-semibold text-primary-600">
                      {user.totalGuesses > 0 
                        ? Math.round(user.points / user.totalGuesses)
                        : 0}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-500">Photos/Guess Ratio:</span>
                    <div className="font-semibold text-blue-600">
                      {user.totalGuesses > 0 
                        ? (user.photosUploaded / user.totalGuesses).toFixed(1)
                        : 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 