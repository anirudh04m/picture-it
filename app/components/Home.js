'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Camera, MapPin, Trophy, Users, Zap, Upload } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Camera className="h-8 w-8 text-primary-600" />,
      title: 'Upload Photos',
      description: 'Share your travel photos and challenge others to guess where they were taken.'
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary-600" />,
      title: 'Guess Locations',
      description: 'Test your geography knowledge by guessing where photos were taken around the world.'
    },
    {
      icon: <Trophy className="h-8 w-8 text-primary-600" />,
      title: 'Earn Points',
      description: 'Score points for correct guesses and climb the leaderboard to become the top guesser.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: 'Join Community',
      description: 'Connect with fellow travelers and geography enthusiasts from around the world.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="mb-8">
          <Camera className="h-20 w-20 text-primary-600 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Picture It
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A gamified social media experience where you upload photos and challenge others to guess the location. 
            Test your geography knowledge and earn points!
          </p>
        </div>

        {user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload" className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Photo</span>
            </Link>
            <Link href="/guess" className="btn-secondary text-lg px-8 py-3 flex items-center justify-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Start Guessing</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Stats Section */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-2">{user.points}</div>
            <div className="text-gray-600">Total Points</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">{user.correctGuesses}</div>
            <div className="text-gray-600">Correct Guesses</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{user.totalGuesses}</div>
            <div className="text-gray-600">Total Guesses</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{user.photosUploaded}</div>
            <div className="text-gray-600">Photos Uploaded</div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center hover:shadow-lg transition-shadow">
              <div className="mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="card text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your Adventure?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of users exploring the world through photos and geography challenges.
        </p>
        {user ? (
          <Link href="/guess" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Start Guessing Now</span>
          </Link>
        ) : (
          <Link href="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Join Picture It</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home; 