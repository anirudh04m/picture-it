import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStats } from '../features/users/userSlice';
import { Camera, MapPin, Trophy, Upload, TrendingUp, Target, Clock } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userStats, statsLoading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUserStats());
  }, [dispatch]);

  const quickActions = [
    {
      title: 'Guess Location',
      description: 'Test your knowledge by guessing photo locations',
      icon: MapPin,
      link: '/guess',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      title: 'Upload Photo',
      description: 'Share a photo for others to guess',
      icon: Upload,
      link: '/upload',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      title: 'My Photos',
      description: 'View and manage your uploaded photos',
      icon: Camera,
      link: '/my-photos',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
    {
      title: 'Leaderboard',
      description: 'See how you rank against other players',
      icon: Trophy,
      link: '/leaderboard',
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-lg text-gray-600">
          Ready to explore the world through photos?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : userStats?.totalPoints || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Correct Guesses</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : userStats?.correctGuesses || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Camera className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Photos Uploaded</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : userStats?.photosUploaded || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {statsLoading ? '...' : userStats?.averageGuessTime ? `${userStats.averageGuessTime}s` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${action.color} ${action.hoverColor} transition-colors duration-200`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Photos</h3>
            <p className="text-gray-600">
              Share photos from your travels and adventures. Set the difficulty level to earn more points!
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold text-lg">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Guess Locations</h3>
            <p className="text-gray-600">
              Test your knowledge by guessing where photos were taken. Earn points for correct guesses!
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold text-lg">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Compete & Win</h3>
            <p className="text-gray-600">
              Climb the leaderboard and compete with other players. The faster you guess, the more points you earn!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 