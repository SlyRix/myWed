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

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create a preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewImage(event.target.result);
            };
            reader.readAsDataURL(file);

            // Show instructions for where to save the file
            const fileName = file.name;
            const suggestedPath = `/images/${fileName}`;
            setManualUrl(suggestedPath);
            onImageSelect(suggestedPath);

            // Show upload instructions
            alert(`📋 Image selected: ${fileName}\n\n✅ To use this image:\n\n1. Copy "${fileName}" to:\n   public/images/${fileName}\n\n2. Rebuild and redeploy the website\n\n3. The image path is already set to:\n   ${suggestedPath}\n\nOR you can use any image hosting service and paste the URL in the field below.`);
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

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
                {/* Upload New Image */}
                <label className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer flex items-center gap-2 text-sm">
                    <Icon path={mdiUpload} size={0.7} />
                    Upload New Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
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

            {/* Help Text */}
            <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                <strong>💡 How to add new images:</strong>
                <ol className="list-decimal ml-4 mt-1 space-y-1">
                    <li>Click "Upload New Image" and select your photo</li>
                    <li>Copy the file to <code className="bg-white px-1 rounded">public/images/</code> folder on your computer</li>
                    <li>Rebuild and redeploy the website (or ask developer)</li>
                    <li>The image path is automatically set for you</li>
                </ol>
                <p className="mt-2">
                    <strong>Or</strong> use any online image hosting (Imgur, Google Photos, etc.) and paste the URL.
                </p>
            </div>
        </div>
    );
};

export default ImageUploader;
