import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mdiCloudUpload } from '@mdi/js';
import Icon from '@mdi/react';

const PhotoUpload = ({ onPhotoUpload }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [objectUrls, setObjectUrls] = useState([]);
    const fileInputRef = useRef(null);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    // Cleanup effect to revoke object URLs and clear timers
    useEffect(() => {
        return () => {
            // Revoke all object URLs when component unmounts
            objectUrls.forEach(url => URL.revokeObjectURL(url));

            // Clear any active timers
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [objectUrls]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Revoke previous object URLs before creating new ones
        objectUrls.forEach(url => URL.revokeObjectURL(url));

        setIsUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        intervalRef.current = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    return 100;
                }
                return prev + 5;
            });
        }, 100);

        // Process files to create photo objects
        const urls = [];
        const newPhotos = files.map((file, index) => {
            const url = URL.createObjectURL(file);
            urls.push(url);
            return {
                id: Date.now() + index,
                src: url,
                alt: file.name
            };
        });

        setObjectUrls(urls);

        // Simulate completed upload after "progress" reaches 100%
        timeoutRef.current = setTimeout(() => {
            onPhotoUpload(newPhotos);
            setIsUploading(false);
            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            timeoutRef.current = null;
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
                className="flex items-center justify-center gap-2 cursor-pointer bg-christian-accent text-white py-3 px-6 rounded-lg hover:shadow-md transition-shadow duration-300 mb-4"
            >
                <Icon path={mdiCloudUpload} size={1} />
                <span>Upload Your Photos</span>
            </label>

            {isUploading && (
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-christian-accent"
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