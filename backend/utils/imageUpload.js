const { cloudinary } = require('../config/cloudinary');

/**
 * Uploads an image to Cloudinary
 * @param {string} imagePath - The file path or base64 image data
 * @returns {Promise} - Cloudinary upload response
 */
const uploadImage = async (imagePath) => {
  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'designer-hub',
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Image upload failed');
  }
};

/**
 * Deletes an image from Cloudinary
 * @param {string} publicId - The public ID of the image
 * @returns {Promise} - Cloudinary deletion response
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Image deletion failed');
  }
};

module.exports = {
  uploadImage,
  deleteImage
}; 