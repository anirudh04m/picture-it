import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhotos } from '../features/photos/photoSlice';
import { submitGuess, clearLastGuessResult } from '../features/guesses/guessSlice';
import { MapPin, Clock, Target, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const GuessLocation = () => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const dispatch = useDispatch();
  const { photos, loading } = useSelector((state) => state.photos);
  const { submitLoading, lastGuessResult } = useSelector((state) => state.guesses);

  useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  useEffect(() => {
    if (photos.length > 0 && currentPhotoIndex < photos.length) {
      setStartTime(Date.now());
      setShowResult(false);
      setGuess('');
    }
  }, [currentPhotoIndex, photos.length]);

  useEffect(() => {
    if (lastGuessResult) {
      setShowResult(true);
    }
  }, [lastGuessResult]);

  const moveToNextPhoto = () => {
    dispatch(clearLastGuessResult());
    setShowResult(false);
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      setCurrentPhotoIndex(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!guess.trim()) {
      toast.error('Please enter your guess');
      return;
    }

    if (!photos[currentPhotoIndex]) {
      toast.error('No photo available');
      return;
    }

    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000);

    // Parse location into city and country
    const locationParts = guess.trim().split(',').map(part => part.trim());
    const city = locationParts[0] || '';
    const country = locationParts[1] || locationParts[0] || '';

    if (!city || !country) {
      toast.error('Please enter location in format: City, Country (e.g., Paris, France)');
      return;
    }

    const guessData = {
      photoId: photos[currentPhotoIndex]._id,
      guessedLocation: {
        city: city,
        country: country
      },
      timeToGuess: timeTaken,
    };

    await dispatch(submitGuess(guessData));
  };

  const handleSkip = () => {
    if (showResult) {
      // If showing result, move to next photo
      moveToNextPhoto();
    } else {
      // If not showing result, just skip to next photo
      if (currentPhotoIndex < photos.length - 1) {
        setCurrentPhotoIndex(currentPhotoIndex + 1);
      } else {
        setCurrentPhotoIndex(0);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Photos Available</h2>
          <p className="text-gray-600 mb-6">
            There are no photos to guess right now. Check back later or upload some photos yourself!
          </p>
        </div>
      </div>
    );
  }

  const currentPhoto = photos[currentPhotoIndex];
  const timeElapsed = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h1 className="text-3xl font-bold text-center mb-2">Guess the Location</h1>
          <p className="text-center text-blue-100">
            Photo {currentPhotoIndex + 1} of {photos.length}
          </p>
        </div>

        {/* Photo Display */}
        <div className="relative">
          <img
            src={currentPhoto?.imageUrl}
            alt="Guess the location"
            className="w-full h-96 object-cover"
          />
          
          {/* Timer */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{timeElapsed}s</span>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentPhoto?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              currentPhoto?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentPhoto?.difficulty?.charAt(0).toUpperCase() + currentPhoto?.difficulty?.slice(1)}
            </span>
          </div>
        </div>

        {/* Guess Form */}
        {!showResult && (
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="guess" className="block text-sm font-medium text-gray-700 mb-2">
                  Where was this photo taken?
                </label>
                <input
                  type="text"
                  id="guess"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Enter the location (e.g., Paris, France)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  disabled={submitLoading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Format: City, Country (e.g., Paris, France or Tokyo, Japan)
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={submitLoading || !guess.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Guess'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={submitLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Skip
                </button>
              </div>
            </form>

            {/* Scoring Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Scoring System</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Base points: {currentPhoto?.difficulty === 'easy' ? 5 : currentPhoto?.difficulty === 'medium' ? 10 : 15} for correct guess</li>
                    <li>• Time bonus: Up to 5 additional points for quick guesses</li>
                    <li>• Guesses are case-insensitive and allow for minor spelling variations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result Display */}
        {showResult && lastGuessResult && (
          <div className="p-6">
            <div className={`text-center p-6 rounded-lg ${
              lastGuessResult.isCorrect 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="mb-4">
                {lastGuessResult.isCorrect ? (
                  <Target className="mx-auto h-12 w-12 text-green-600" />
                ) : (
                  <MapPin className="mx-auto h-12 w-12 text-red-600" />
                )}
              </div>
              
              <h3 className={`text-xl font-bold mb-2 ${
                lastGuessResult.isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {lastGuessResult.isCorrect ? 'Correct!' : 'Incorrect'}
              </h3>
              
              <p className="text-gray-700 mb-2">
                Your guess: <span className="font-medium">{lastGuessResult.guessedLocation?.city}, {lastGuessResult.guessedLocation?.country}</span>
              </p>
              
              <p className="text-gray-700 mb-2">
                Actual location: <span className="font-medium">{lastGuessResult.actualLocation?.city}, {lastGuessResult.actualLocation?.country}</span>
              </p>
              
              {lastGuessResult.isCorrect && (
                <div className="bg-green-100 rounded-lg p-3 mt-4">
                  <p className="text-green-800 font-medium">
                    +{lastGuessResult.pointsEarned} points earned!
                  </p>
                  <p className="text-green-700 text-sm">
                    Time taken: {lastGuessResult.timeToGuess || lastGuessResult.timeTaken}s
                  </p>
                </div>
              )}
              
              <div className="mt-6 flex space-x-4 justify-center">
                <button
                  onClick={moveToNextPhoto}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Next Photo
                </button>
                
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuessLocation; 