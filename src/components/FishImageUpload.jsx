import { useState, useRef, useEffect } from 'react';

const FishImageUpload = ({ 
  value = '', 
  onChange, 
  label = 'Fish Image',
  id = 'fish-image-upload'
}) => {
  const [localImagePath, setLocalImagePath] = useState('');
  const [cloudImageUrl, setCloudImageUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageSource, setImageSource] = useState(null); // 'local' | 'cloudinary' | null
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Cloudinary configuration
  const CLOUDINARY_CONFIG = {
    cloud_name: 'dkfvnzidu',
    upload_preset: 'fish_upload',
    folder: 'fish/',
    api_endpoint: 'https://api.cloudinary.com/v1_1/dkfvnzidu/image/upload'
  };

  // Initialize with existing value
  useEffect(() => {
    if (value) {
      // Check if it's a local path
      if (value.startsWith('/dist/images/fish/') || value.startsWith('/images/fish/')) {
        setLocalImagePath(value);
        setPreviewUrl(value);
        setImageSource('local');
        setCloudImageUrl('');
      } 
      // Check if it's a Cloudinary URL
      else if (value.includes('cloudinary.com')) {
        setCloudImageUrl(value);
        setPreviewUrl(value);
        setImageSource('cloudinary');
        setLocalImagePath('');
      }
      // Could be any URL (treat as external/cloudinary)
      else {
        setCloudImageUrl(value);
        setPreviewUrl(value);
        setImageSource('cloudinary');
        setLocalImagePath('');
      }
    } else {
      // Reset if value is empty
      setLocalImagePath('');
      setCloudImageUrl('');
      setPreviewUrl('');
      setImageSource(null);
    }
  }, [value]);

  // Handle local path input
  const handleLocalPathChange = (e) => {
    const path = e.target.value.trim();
    setError('');

    if (path) {
      // Normalize path to ensure it's in the correct format
      let normalizedPath = path;
      if (!path.startsWith('/')) {
        normalizedPath = `/${path}`;
      }
      
      // If it doesn't start with /dist/images/fish/ or /images/fish/, add the prefix
      if (!normalizedPath.startsWith('/dist/images/fish/') && !normalizedPath.startsWith('/images/fish/')) {
        // Remove leading slash if present, then add the full path
        const cleanPath = normalizedPath.replace(/^\//, '');
        normalizedPath = `/dist/images/fish/${cleanPath}`;
      }
      
      setLocalImagePath(normalizedPath);
      setImageSource('local');
      setCloudImageUrl('');
      setPreviewUrl(normalizedPath);
      onChange && onChange(normalizedPath);
    } else {
      setLocalImagePath('');
      setImageSource(null);
      setCloudImageUrl('');
      setPreviewUrl('');
      onChange && onChange('');
    }
  };

  // Handle file selection for Cloudinary upload
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Please select an image smaller than 5MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    setLocalImagePath(''); // Clear local path when uploading

    try {
      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
      formData.append('folder', CLOUDINARY_CONFIG.folder);

      // Simulate upload progress (Cloudinary doesn't support progress events directly)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload to Cloudinary
      const response = await fetch(CLOUDINARY_CONFIG.api_endpoint, {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cloudinary returns secure_url for the uploaded image
      const imageUrl = data.secure_url || data.url;
      
      setCloudImageUrl(imageUrl);
      setPreviewUrl(imageUrl);
      setImageSource('cloudinary');
      setUploadProgress(100);
      
      // Notify parent component
      onChange && onChange(imageUrl);

      // Reset progress after a moment
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);

    } catch (err) {
      setError(err.message || 'Failed to upload image. Please try again.');
      setUploadProgress(0);
      setPreviewUrl('');
      setCloudImageUrl('');
      setImageSource(null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setLocalImagePath('');
    setCloudImageUrl('');
    setPreviewUrl('');
    setImageSource(null);
    setError('');
    setUploadProgress(0);
    onChange && onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Local Image Path Input */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Local Image Path (Optional)
        </label>
        <input
          type="text"
          value={localImagePath}
          onChange={handleLocalPathChange}
          placeholder="/dist/images/fish/rohu.png"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter path like: <code className="bg-gray-100 px-1 rounded">/dist/images/fish/fishname.png</code>
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-3 text-sm text-gray-500">OR</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Cloudinary Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id={`${id}-file-input`}
        />
        <label
          htmlFor={`${id}-file-input`}
          className={`cursor-pointer flex flex-col items-center space-y-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            {isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            ) : (
              <span className="text-2xl">☁️</span>
            )}
          </div>
          <span className="text-sm text-gray-600">
            {isUploading ? 'Uploading...' : 'Click to upload to Cloudinary'}
          </span>
          <span className="text-xs text-gray-500">JPG, PNG, WebP (max 5MB)</span>
        </label>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4 w-full">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">❌ {error}</p>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div className="relative border border-gray-200 rounded-xl p-4 bg-gray-50">
          <div className="flex items-start space-x-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              onError={(e) => {
                e.target.src = '/images/fish/placeholder.jpg';
              }}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Image Preview</span>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
              
              {/* Image Source Indicator */}
              <div className="mt-2">
                {imageSource === 'local' && (
                  <p className="text-xs text-gray-600 flex items-center">
                    <span className="mr-1">📂</span>
                    <span>From local folder</span>
                  </p>
                )}
                {imageSource === 'cloudinary' && (
                  <p className="text-xs text-gray-600 flex items-center">
                    <span className="mr-1">☁️</span>
                    <span>Stored on Cloudinary</span>
                  </p>
                )}
              </div>

              {/* Current URL Display */}
              <div className="mt-2">
                <p className="text-xs text-gray-500 break-all">
                  <strong>URL:</strong> {previewUrl}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden input for form submission (contains final image URL) */}
      <input
        type="hidden"
        name="image"
        value={previewUrl}
      />
      
      {/* Additional hidden inputs for form data */}
      <input
        type="hidden"
        name="localImagePath"
        value={localImagePath}
      />
      <input
        type="hidden"
        name="cloudImageUrl"
        value={cloudImageUrl}
      />
    </div>
  );
};

export default FishImageUpload;
