// src/components/admin/ImageUploader.js
import React, { useState } from 'react';
import { mdiUpload, mdiImage, mdiCheck, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';

/**
 * Image Uploader Component
 * Provides visual image selection and upload instructions
 * Since we can't upload directly to server without backend storage,
 * this component helps users understand the process
 */
const ImageUploader = ({ currentImage, onImageSelect, label = "Image" }) => {
    const [showUploadHelp, setShowUploadHelp] = useState(false);
    const [previewImage, setPreviewImage] = useState(currentImage);
    const [manualUrl, setManualUrl] = useState(currentImage || '');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    // Common image suggestions based on existing patterns
    const commonImages = [
        { path: '/images/placeholder.jpg', name: 'Placeholder' },
        { path: '/images/hindu-ceremony/HinduHero.jpg', name: 'Hindu Hero' },
        { path: '/images/story-met.jpg', name: 'Story - Met' },
        { path: '/images/story-firstmeet.jpg', name: 'Story - First Meet' },
        { path: '/images/story-firstdate.jpg', name: 'Story - First Date' },
        { path: '/images/story-families.jpg', name: 'Story - Families' },
        { path: '/images/story-proposal.jpg', name: 'Story - Proposal' },
        { path: '/images/story-engagement.jpg', name: 'Story - Engagement' },
        { path: '/images/story-wedding.jpg', name: 'Story - Wedding' },
    ];

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setManualUrl(url);
        setPreviewImage(url);
        onImageSelect(url);
    };

    const handleQuickSelect = (path) => {
        setManualUrl(path);
        setPreviewImage(path);
        onImageSelect(path);
        setShowUploadHelp(false);
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setUploadError('File too large. Maximum size is 5MB.');
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
            return;
        }

        setUploadError(null);
        setIsUploading(true);

        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target.result);
        };
        reader.readAsDataURL(file);

        try {
            // Upload to API
            const formData = new FormData();
            formData.append('image', file);

            const token = localStorage.getItem('adminToken');
            const apiUrl = process.env.REACT_APP_API_URL || 'https://api.rushel.me/api';

            const response = await fetch(`${apiUrl}/upload-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const result = await response.json();

            // Set the uploaded image URL
            setManualUrl(result.url);
            onImageSelect(result.url);

            // Show success message
            alert(`✅ Image uploaded successfully!\n\nURL: ${result.url}\n\nThe image is now available immediately - no rebuild needed!`);
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError(error.message || 'Failed to upload image');
            alert(`❌ Upload failed: ${error.message}\n\nPlease try again or use a URL instead.`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-gray-700 font-medium">{label}</label>

            {/* Preview */}
            {previewImage && (
                <div className="relative">
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="h-40 w-full object-cover rounded-lg border-2 border-gray-300"
                        onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                        }}
                    />
                    <button
                        onClick={() => {
                            setPreviewImage('');
                            setManualUrl('');
                            onImageSelect('');
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        title="Clear image"
                    >
                        <Icon path={mdiClose} size={0.7} />
                    </button>
                </div>
            )}

            {/* URL Input */}
            <div className="space-y-2">
                <input
                    type="text"
                    value={manualUrl}
                    onChange={handleUrlChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="/images/your-image.jpg or https://..."
                />
                <p className="text-xs text-gray-500">
                    Enter image path (e.g., /images/photo.jpg) or full URL
                </p>
            </div>

            {/* Upload Error */}
            {uploadError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {uploadError}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
                {/* Upload New Image */}
                <label className={`px-4 py-2 ${isUploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md cursor-pointer flex items-center gap-2 text-sm`}>
                    {isUploading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Icon path={mdiUpload} size={0.7} />
                            Upload New Image
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                    />
                </label>

                {/* Browse Existing */}
                <button
                    type="button"
                    onClick={() => setShowUploadHelp(!showUploadHelp)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2 text-sm"
                >
                    <Icon path={mdiImage} size={0.7} />
                    {showUploadHelp ? 'Hide' : 'Browse'} Existing Images
                </button>
            </div>

            {/* Existing Images Browser */}
            {showUploadHelp && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium mb-3 text-sm">Select from existing images:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                        {commonImages.map((img, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleQuickSelect(img.path)}
                                className={`p-2 border-2 rounded-lg hover:border-blue-500 transition-all ${
                                    manualUrl === img.path ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                }`}
                            >
                                <div className="aspect-video bg-gray-200 rounded mb-2 overflow-hidden">
                                    <img
                                        src={img.path}
                                        alt={img.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/images/placeholder.jpg';
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-700 font-medium truncate">{img.name}</p>
                                <p className="text-xs text-gray-500 truncate">{img.path}</p>
                                {manualUrl === img.path && (
                                    <Icon path={mdiCheck} size={0.5} className="text-blue-500 mx-auto mt-1" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ImageUploader;
