/**
 * Cloudinary Upload Utility
 * Reusable utility for uploading images to Cloudinary
 * Uses the same configuration as FishImageUpload component
 */

const CLOUDINARY_CONFIG = {
  cloud_name: 'dkfvnzidu',
  upload_preset: 'fish_upload',
  folder: 'owner/', // Use owner folder for owner photos
  api_endpoint: 'https://api.cloudinary.com/v1_1/dkfvnzidu/image/upload'
};

/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {Object} options - Optional configuration
 * @param {string} options.folder - Custom folder (default: 'owner/')
 * @param {Function} options.onProgress - Progress callback (progress: 0-100)
 * @returns {Promise<string>} - Returns the secure_url of the uploaded image
 */
export const uploadToCloudinary = async (file, options = {}) => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Please select an image smaller than 5MB.');
    }

    // Create FormData for Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
    formData.append('folder', options.folder || CLOUDINARY_CONFIG.folder);

    // Simulate upload progress (Cloudinary doesn't support progress events directly)
    if (options.onProgress) {
      const progressInterval = setInterval(() => {
        // Simulate progress (0-90%)
        const currentProgress = Math.min(90, Date.now() % 90);
        options.onProgress(currentProgress);
      }, 100);
    }

    // Upload to Cloudinary
    const response = await fetch(CLOUDINARY_CONFIG.api_endpoint, {
      method: 'POST',
      body: formData
    });

    if (options.onProgress) {
      options.onProgress(100);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Cloudinary returns secure_url for the uploaded image
    const imageUrl = data.secure_url || data.url;
    
    if (!imageUrl) {
      throw new Error('Upload succeeded but no image URL returned');
    }

    return imageUrl;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Upload owner photo to Cloudinary
 * Convenience wrapper for owner photo uploads
 */
export const uploadOwnerPhoto = async (file, onProgress) => {
  return uploadToCloudinary(file, {
    folder: 'owner/',
    onProgress
  });
};

