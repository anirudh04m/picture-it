import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyPhotos } from '../features/photos/photoSlice';
import { Camera, MapPin, Users, Clock, Trash2 } from 'lucide-react';

const MyPhotos = () => {
  const dispatch = useDispatch();
  const { myPhotos, loading } = useSelector((state) => state.photos);

  useEffect(() => {
    dispatch(fetchMyPhotos());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Photos</h1>
        <p className="text-gray-600">
          Manage and view all the photos you've uploaded for others to guess.
        </p>
      </div>

      {myPhotos.length === 0 ? (
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Photos Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't uploaded any photos yet. Start sharing your adventures!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPhotos.map((photo) => (
            <div key={photo._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                {photo.imageUrl ? (
                  <img
                    src={photo.imageUrl}
                    alt={photo.location || photo.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                    No image available
                  </div>
                )}
                
                {/* Difficulty Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    photo.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    photo.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {photo.difficulty.charAt(0).toUpperCase() + photo.difficulty.slice(1)}
                  </span>
                </div>

                {/* Points Badge */}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {photo.difficulty === 'easy' ? 5 : photo.difficulty === 'medium' ? 10 : 15} pts
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium text-gray-900">{photo.location || `${photo.actualLocation?.city}, ${photo.actualLocation?.country}`}</span>
                </div>

                {photo.title && (
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{photo.title}</h3>
                )}

                {photo.description && (
                  <p className="text-sm text-gray-600 mb-3">{photo.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{photo.guessesCount || photo.totalGuesses || 0} guesses</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Stats */}
                {photo.guessesCount > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Correct guesses:</span>
                      <span className="font-medium text-green-600">
                        {photo.correctGuesses || 0}/{photo.guessesCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Success rate:</span>
                      <span className="font-medium text-blue-600">
                        {photo.guessesCount > 0 
                          ? Math.round(((photo.correctGuesses || 0) / photo.guessesCount) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    ID: {photo._id.slice(-8)}
                  </span>
                  <button
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPhotos; 