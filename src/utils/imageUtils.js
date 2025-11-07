/**
 * Get fish image URL with fallback to default image
 * 
 * @param {string|undefined|null} imageUrl - The fish image URL (can be Cloudinary URL, local path, or invalid)
 * @returns {string} - Valid image URL, defaults to /images/Fish_default_image.png if invalid
 * 
 * Fallback Rules:
 * - If imageUrl is missing, empty (""), undefined, null, or invalid → use default image
 * - If imageUrl is a valid string → use it
 * - Default image path: /images/Fish_default_image.png
 */
export const getFishImageUrl = (imageUrl) => {
  // Default image path
  const DEFAULT_IMAGE = '/images/Fish_default_image.png';
  
  // Check if imageUrl is missing, empty, undefined, null, or invalid
  if (!imageUrl || 
      imageUrl === '' || 
      imageUrl === undefined || 
      imageUrl === null ||
      typeof imageUrl !== 'string' ||
      imageUrl.trim() === '') {
    return DEFAULT_IMAGE;
  }
  
  // Check if it's a valid URL format (http/https) or valid local path
  const trimmedUrl = imageUrl.trim();
  
  // If it's a valid URL (starts with http:// or https://) or valid local path (starts with /)
  if (trimmedUrl.startsWith('http://') || 
      trimmedUrl.startsWith('https://') || 
      trimmedUrl.startsWith('/') ||
      trimmedUrl.startsWith('./')) {
    return trimmedUrl;
  }
  
  // If it doesn't match valid patterns, use default
  return DEFAULT_IMAGE;
};

/**
 * Handle image error event - replace with default image
 * 
 * @param {Event} event - The error event from img onError handler
 */
export const handleImageError = (event) => {
  const DEFAULT_IMAGE = '/images/Fish_default_image.png';
  
  // Prevent infinite loop if default image also fails
  if (event.target.src !== DEFAULT_IMAGE && event.target.src !== `${window.location.origin}${DEFAULT_IMAGE}`) {
    event.target.src = DEFAULT_IMAGE;
    event.target.alt = 'Default visual (no original available)';
  }
};

/**
 * Check if an image URL is valid
 * 
 * @param {string|undefined|null} imageUrl - The image URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidImageUrl = (imageUrl) => {
  if (!imageUrl || 
      imageUrl === '' || 
      imageUrl === undefined || 
      imageUrl === null ||
      typeof imageUrl !== 'string' ||
      imageUrl.trim() === '') {
    return false;
  }
  
  const trimmedUrl = imageUrl.trim();
  
  // Valid if it's a URL or local path
  return trimmedUrl.startsWith('http://') || 
         trimmedUrl.startsWith('https://') || 
         trimmedUrl.startsWith('/') ||
         trimmedUrl.startsWith('./');
};

