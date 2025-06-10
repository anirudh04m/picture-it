'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MapPin, Clock, User, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const GuessLocation = () => {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [guess, setGuess] = useState({ country: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    if (photos.length > 0 && currentPhotoIndex < photos.length) {
      setStartTime(Date.now());
      setShowResult(false);
      setResult(null);
      setGuess({ country: '', city: '' });
    }
  }, [currentPhotoIndex, photos]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/photos');
      setPhotos(response.data);
    } catch (error) {
      toast.error('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handleGuessChange = (e) => {
    const { name, value } = e.target;
    // Allow normal typing, just trim whitespace for display
    setGuess(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitGuess = async (e) => {
    e.preventDefault();
    
    if (!guess.country || !guess.city) {
      toast.error('Please enter both country and city');
      return;
    }

    setSubmitting(true);
    const timeToGuess = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await axios.post('/api/guesses', {
        photoId: photos[currentPhotoIndex]._id,
        guessedLocation: guess,
        timeToGuess
      });

      setResult(response.data);
      setShowResult(true);
      
      // Update user stats in context if needed
      // This would typically be handled by the auth context
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit guess');
    } finally {
      setSubmitting(false);
    }
  };

  const nextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    } else {
      toast.success('You\'ve completed all available photos!');
      router.push('/');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Photos Available</h2>
        <p className="text-gray-600 mb-6">
          You've either guessed all available photos or there are no new photos to guess right now. 
          Check back later for new uploads!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => router.push('/upload')} className="btn-primary">
            Upload a Photo
          </button>
          <button onClick={() => router.push('/leaderboard')} className="btn-secondary">
            View Leaderboard
          </button>
        </div>
      </div>
    );
  }

  const currentPhoto = photos[currentPhotoIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Guess the Location
        </h1>
        <p className="text-gray-600">
          Photo {currentPhotoIndex + 1} of {photos.length}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photo Display */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">{currentPhoto.user.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {startTime ? Math.floor((Date.now() - startTime) / 1000) : 0}s
              </span>
            </div>
          </div>

          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title}
            className="w-full h-80 object-cover rounded-lg mb-4"
          />

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {currentPhoto.title}
            </h3>
            {currentPhoto.description && (
              <p className="text-gray-600 mb-4">{currentPhoto.description}</p>
            )}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className={getDifficultyColor(currentPhoto.difficulty)}>
                {capitalizeFirstLetter(currentPhoto.difficulty)}
              </span>
              <span>{currentPhoto.points} points</span>
            </div>
          </div>
        </div>

        {/* Guess Form */}
        <div className="card">
          {!showResult ? (
            <form onSubmit={submitGuess} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Where was this photo taken?
                </h3>
                <p className="text-gray-600 mb-6">
                  Enter the country and city where you think this photo was taken.
                </p>
                
                {/* Scoring Rules */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Scoring System:</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Base Points:</strong> {currentPhoto.points} points for correct guess</p>
                    <p><strong>Time Bonus:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Under 30 seconds: +5 bonus points</li>
                      <li>• 30-60 seconds: +3 bonus points</li>
                      <li>• Over 60 seconds: +1 bonus point</li>
                    </ul>
                    <p className="mt-2 text-xs">
                      <strong>Total possible:</strong> {currentPhoto.points + 5} points for a quick correct guess!
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  required
                  className="input-field"
                  placeholder="e.g., United States"
                  value={guess.country}
                  onChange={handleGuessChange}
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Case doesn't matter - you can type in any format
                </p>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  className="input-field"
                  placeholder="e.g., New York"
                  value={guess.city}
                  onChange={handleGuessChange}
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Case doesn't matter - you can type in any format
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Guess'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                {result.isCorrect ? (
                  <div className="mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Correct!</h3>
                    <p className="text-green-600">You earned {result.pointsEarned} points!</p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-red-600 mb-2">Incorrect</h3>
                    <p className="text-red-600">Better luck next time!</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Your Guess:</h4>
                <p className="text-gray-600">
                  {guess.city}, {guess.country}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Actual Location:</h4>
                <p className="text-gray-600">
                  {result.actualLocation.city}, {result.actualLocation.country}
                </p>
              </div>

              <button
                onClick={nextPhoto}
                className="w-full btn-primary py-3 text-lg flex items-center justify-center space-x-2"
              >
                <span>Next Photo</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuessLocation; 