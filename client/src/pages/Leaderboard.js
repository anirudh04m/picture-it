import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../features/users/userSlice';
import { Trophy, Medal, TrendingUp, Clock, Target, Camera } from 'lucide-react';

const Leaderboard = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const dispatch = useDispatch();
  const { leaderboard, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchLeaderboard(timeFilter));
  }, [dispatch, timeFilter]);

  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Medal className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800';
    if (rank === 2) return 'bg-gray-100 text-gray-800';
    if (rank === 3) return 'bg-amber-100 text-amber-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
            <p className="text-gray-600">
              See how you rank against other players
            </p>
          </div>
          <Trophy className="h-12 w-12 text-yellow-500" />
        </div>

        {/* Time Filter */}
        <div className="flex space-x-2">
          {timeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTimeFilter(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Player</div>
              <div className="col-span-2 text-center">Points</div>
              <div className="col-span-2 text-center">Guesses</div>
              <div className="col-span-2 text-center">Photos</div>
              <div className="col-span-1 text-center">Avg Time</div>
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="divide-y divide-gray-200">
            {leaderboard.length === 0 ? (
              <div className="p-8 text-center">
                <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">No data available for this time period.</p>
              </div>
            ) : (
              leaderboard.map((user, index) => (
                <div
                  key={user._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Rank */}
                    <div className="col-span-1">
                      <div className="flex items-center">
                        {getRankIcon(index + 1)}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRankBadge(index + 1)}`}>
                          #{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Player */}
                    <div className="col-span-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.username}</p>
                          <p className="text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="col-span-2 text-center">
                      <div className="flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="font-bold text-lg text-gray-900">{user.points}</span>
                      </div>
                    </div>

                    {/* Correct Guesses */}
                    <div className="col-span-2 text-center">
                      <div className="flex items-center justify-center">
                        <Target className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="font-medium text-gray-900">{user.correctGuesses || 0}</span>
                      </div>
                    </div>

                    {/* Photos Uploaded */}
                    <div className="col-span-2 text-center">
                      <div className="flex items-center justify-center">
                        <Camera className="h-4 w-4 text-purple-600 mr-1" />
                        <span className="font-medium text-gray-900">{user.photosUploaded || 0}</span>
                      </div>
                    </div>

                    {/* Average Time */}
                    <div className="col-span-1 text-center">
                      <div className="flex items-center justify-center">
                        <Clock className="h-4 w-4 text-gray-600 mr-1" />
                        <span className="text-sm text-gray-600">
                          {user.averageGuessTime ? `${user.averageGuessTime}s` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {leaderboard.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Players</p>
                <p className="text-2xl font-bold text-gray-900">{leaderboard.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Top Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leaderboard[0]?.points || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {leaderboard.length > 0 
                    ? Math.round(leaderboard.reduce((sum, user) => sum + user.points, 0) / leaderboard.length)
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 