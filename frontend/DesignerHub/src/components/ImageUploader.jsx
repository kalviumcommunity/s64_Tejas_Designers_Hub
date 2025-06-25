import React, { useState } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import axios from 'axios';
import { motion } from 'framer-motion';

const ImageUploader = ({ onImagesUploaded, maxImages = 5 }) => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    setError(null);
    const files = Array.from(e.target.files);
    
    // Validate file count
    if (files.length + previews.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images`);
      return;
    }
    
    // Generate previews
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPreviews([...previews, ...newPreviews]);
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    const newPreviews = [...previews];
    const newImages = [...images];
    
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index].preview);
    
    newPreviews.splice(index, 1);
    newImages.splice(index, 1);
    
    setPreviews(newPreviews);
    setImages(newImages);
  };

  const uploadImages = async () => {
    if (images.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      images.forEach(file => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('sellerToken');
      console.log('Using token for upload:', token ? 'Yes (token exists)' : 'No token found');
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Upload response:', response.data);

      // Clear selected images after successful upload
      setImages([]);
      setPreviews([]);
      
      // Call the callback with uploaded image URLs
      if (onImagesUploaded && response.data && response.data.images) {
        // Process image data from response
        const processedImages = response.data.images.map(img => {
          // Ensure proper format with url and publicId
          if (typeof img === 'object' && img.url) {
            return img;
          }
          // Fallback for string values
          return { 
            url: typeof img === 'string' ? img : img.path || '',
            publicId: typeof img === 'string' ? img.split('/').pop() : img.filename || img.publicId || ''
          };
        });
        
        console.log('Passing images to parent:', processedImages);
        onImagesUploaded(processedImages);
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload images';
      console.error('Error details:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
          {/* Image previews */}
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
              <img 
                src={preview.preview} 
                alt={`Preview ${index}`} 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
                type="button"
              >
                <FiX className="text-red-500" />
              </button>
            </div>
          ))}

          {/* Upload button */}
          {previews.length < maxImages && (
            <motion.label 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md aspect-square cursor-pointer hover:bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiImage className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 text-center">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileSelect} 
                multiple 
                accept="image/*" 
              />
            </motion.label>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={uploadImages}
        disabled={loading || images.length === 0}
        className={`flex items-center justify-center px-4 py-2 rounded-md ${
          loading || images.length === 0
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700'
        } text-white transition-colors`}
        type="button"
      >
        {loading ? (
          <>Uploading...</>
        ) : (
          <>
            <FiUpload className="mr-2" />
            Upload Images
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ImageUploader; 