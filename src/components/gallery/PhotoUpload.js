import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { mdiCloudUpload } from '@mdi/js';
import Icon from '@mdi/react';

const PhotoUpload = ({ onPhotoUpload }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);

        // Process files to create photo objects
        const newPhotos = files.map((file, index) => ({
            id: Date.now() + index,
            src: URL.createObjectURL(file),
            alt: file.name
        }));

        // Simulate completed upload after "progress" reaches 100%
        setTimeout(() => {
            onPhotoUpload(newPhotos);
            setIsUploading(false);
            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            clearInterval(interval);
        }, 2000);
    };

    return (
        <div className="mb-10">
            <input
                type="file"
                id="photo-upload"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
            />
            <label
                htmlFor="photo-upload"
                className="flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-christian-accent to-hindu-secondary text-white py-3 px-6 rounded-lg hover:shadow-md transition-shadow duration-300 mb-4"
            >
                <Icon path={mdiCloudUpload} size={1} />
                <span>Upload Your Photos</span>
            </label>

            {isUploading && (
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-christian-accent to-hindu-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                    >
                        <span className="sr-only">{uploadProgress}%</span>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default PhotoUpload;