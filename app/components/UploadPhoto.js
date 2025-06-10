'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, MapPin, Camera, X } from 'lucide-react';

const UploadPhoto = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    actualLocation: {
      country: '',
      city: ''
    },
    difficulty: 'medium',
    points: 10
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    if (!formData.title || !formData.actualLocation.country || !formData.actualLocation.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', selectedFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('actualLocation[country]', formData.actualLocation.country);
      formDataToSend.append('actualLocation[city]', formData.actualLocation.city);
      formDataToSend.append('difficulty', formData.difficulty);
      formDataToSend.append('points', formData.points);

      await axios.post('/api/photos/upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Photo uploaded successfully!');
      router.push('/my-photos');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upload a Photo
        </h1>
        <p className="text-gray-600">
          Share a photo and challenge others to guess where it was taken
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            {!preview ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-primary-600">Drop the image here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag & drop an image here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, GIF (max 5MB)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="input-field"
              placeholder="Give your photo a catchy title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="input-field"
              placeholder="Add some context about the photo (optional)"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="actualLocation.country"
                required
                className="input-field"
                placeholder="e.g., United States"
                value={formData.actualLocation.country}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="actualLocation.city"
                required
                className="input-field"
                placeholder="e.g., New York"
                value={formData.actualLocation.city}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Difficulty and Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                className="input-field"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="easy">Easy (5 points)</option>
                <option value="medium">Medium (10 points)</option>
                <option value="hard">Hard (15 points)</option>
              </select>
            </div>
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
                Points
              </label>
              <input
                type="number"
                id="points"
                name="points"
                min="5"
                max="20"
                className="input-field"
                value={formData.points}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedFile}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Upload Photo</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPhoto; 