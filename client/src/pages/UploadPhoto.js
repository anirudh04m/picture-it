import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { uploadPhoto, clearError } from '../features/photos/photoSlice';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadPhoto = () => {
  const [formData, setFormData] = useState({
    image: null,
    title: '',
    location: '',
    description: '',
    difficulty: 'easy',
  });
  const [preview, setPreview] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploadLoading, error } = useSelector((state) => state.photos);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error('Please select an image');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!formData.location.trim()) {
      toast.error('Please enter the location');
      return;
    }

    const result = await dispatch(uploadPhoto(formData));
    if (uploadPhoto.fulfilled.match(result)) {
      toast.success('Photo uploaded successfully!');
      navigate('/my-photos');
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setPreview(null);
  };

  const getDifficultyInfo = (difficulty) => {
    const info = {
      easy: { points: 5, color: 'text-green-600', bgColor: 'bg-green-100' },
      medium: { points: 10, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      hard: { points: 15, color: 'text-red-600', bgColor: 'bg-red-100' },
    };
    return info[difficulty];
  };

  const difficultyInfo = getDifficultyInfo(formData.difficulty);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Upload a Photo
        </h1>

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
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600">Drop the image here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag and drop an image here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, GIF
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
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Eiffel Tower"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter a descriptive title for your photo
            </p>
          </div>

          {/* Location Input */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Paris, France"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the location in format: City, Country (e.g., Paris, France)
            </p>
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a description or hint for guessers..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              Optional description or hint for other players
            </p>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="easy">Easy (5 points)</option>
              <option value="medium">Medium (10 points)</option>
              <option value="hard">Hard (15 points)</option>
            </select>
            
            {/* Difficulty Info */}
            <div className={`mt-3 p-3 rounded-md ${difficultyInfo.bgColor}`}>
              <div className="flex items-center">
                <CheckCircle className={`h-5 w-5 ${difficultyInfo.color} mr-2`} />
                <span className={`text-sm font-medium ${difficultyInfo.color}`}>
                  {formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1)} Difficulty
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Players will earn {difficultyInfo.points} points for correctly guessing this location
              </p>
            </div>
          </div>

          {/* Scoring Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Scoring System</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Base points: {difficultyInfo.points} for correct guess</li>
                  <li>• Time bonus: Up to 5 additional points for quick guesses</li>
                  <li>• You earn points when others guess your photos correctly</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploadLoading || !formData.image || !formData.title.trim() || !formData.location.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploadLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
              </div>
            ) : (
              'Upload Photo'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPhoto; 