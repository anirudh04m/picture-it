'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Camera, Trash2, Eye, MapPin, Clock, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MyPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }
      loadMyPhotos();
    }
  }, [user, authLoading, router]);

  const loadMyPhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/photos/my-photos');
      setPhotos(response.data);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast.error('Failed to load your photos');
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (photoId) => {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      await axios.delete(`/api/photos/${photoId}`);
      toast.success('Photo deleted successfully');
      loadMyPhotos(); // Reload the list
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Photos
          </h1>
          <p className="text-gray-600">
            Manage your uploaded photos and see how others are guessing
          </p>
        </div>
        <button
          onClick={() => router.push('/upload')}
          className="btn-primary flex items-center space-x-2"
        >
          <Camera className="h-5 w-5" />
          <span>Upload New Photo</span>
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-16">
          <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Photos Yet</h2>
          <p className="text-gray-600 mb-6">Start by uploading your first photo!</p>
          <button
            onClick={() => router.push('/upload')}
            className="btn-primary"
          >
            Upload Your First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo._id} className="card hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => deletePhoto(photo._id)}
                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    title="Delete photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {photo.title}
                </h3>
                {photo.description && (
                  <p className="text-gray-600 mb-3 text-sm">
                    {photo.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{photo.actualLocation.city}, {photo.actualLocation.country}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Uploaded {formatDate(photo.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{photo.totalGuesses} guesses ({photo.correctGuesses} correct)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    photo.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    photo.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {capitalizeFirstLetter(photo.difficulty)}
                  </span>
                  <span className="text-primary-600 font-medium">
                    {photo.points} points
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Success Rate:</span>
                    <span className="font-medium">
                      {photo.totalGuesses > 0 
                        ? Math.round((photo.correctGuesses / photo.totalGuesses) * 100)
                        : 0}%
                    </span>
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

export default MyPhotos; 