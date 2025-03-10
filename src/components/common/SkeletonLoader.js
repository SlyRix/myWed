import React from 'react';
import { motion } from 'framer-motion';

const SkeletonPulse = ({ className }) => (
    <motion.div
        className={`h-full w-full rounded-lg bg-gray-200 ${className}`}
        animate={{ opacity: [0.7, 0.4, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
    />
);

export const SkeletonText = ({ lines = 1, className = "" }) => (
    <div className={`space-y-2 ${className}`}>
        {Array(lines).fill().map((_, i) => (
            <SkeletonPulse key={i} className="h-4 w-full" />
        ))}
    </div>
);

export const SkeletonImage = ({ className = "", aspectRatio = "aspect-video" }) => (
    <div className={`${aspectRatio} ${className}`}>
        <SkeletonPulse className="h-full w-full" />
    </div>
);

export const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
        <SkeletonImage className="h-48" />
        <div className="p-4 space-y-3">
            <SkeletonPulse className="h-6 w-2/3" />
            <SkeletonText lines={2} />
            <SkeletonPulse className="h-8 w-1/3 mt-4" />
        </div>
    </div>
);

export const SkeletonEventCard = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-2 bg-gray-200"></div>
        <div className="p-6">
            <SkeletonPulse className="h-6 w-3/4 mb-4" />

            <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
                <SkeletonPulse className="h-4 w-1/3" />
            </div>

            <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
                <SkeletonPulse className="h-4 w-1/2" />
            </div>

            <SkeletonText lines={2} className="mb-6" />

            <SkeletonPulse className="h-10 w-1/3 rounded-full" />
        </div>
    </div>
);

export const SkeletonCeremonyTimeline = ({ events = 4 }) => (
    <div className="relative py-8">
        <div className="absolute h-full w-1 bg-gray-200 left-1/2 -translate-x-1/2 hidden md:block"></div>

        <div className="flex flex-col">
            {Array(events).fill().map((_, index) => (
                <div
                    key={index}
                    className={`relative mb-8 md:w-[45%] w-full ${index % 2 === 0 ? 'md:mr-auto md:text-right' : 'md:ml-auto'}`}
                >
                    <div className="bg-white p-5 rounded-lg shadow-md">
                        <SkeletonPulse className="h-4 w-1/4 mb-2" />
                        <SkeletonPulse className="h-5 w-1/2 mb-2" />
                        <SkeletonText lines={2} />
                    </div>

                    <div className={`hidden md:block absolute top-6 w-4 h-4 rounded-full bg-white border-4 border-gray-200 z-10
                        ${index % 2 === 0 ? 'right-0 -translate-x-14' : 'left-0 translate-x-14'}`}>
                    </div>

                    <div className={`hidden md:block absolute top-8 h-1 bg-gray-200 w-14
                        ${index % 2 === 0 ? 'right-0 -translate-x-0' : 'left-0 translate-x-0'}`}>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const SkeletonGallery = ({ items = 6 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(items).fill().map((_, i) => (
            <div key={i} className="relative h-48 overflow-hidden rounded-lg shadow-md">
                <SkeletonPulse className="h-full w-full" />
            </div>
        ))}
    </div>
);

export const SkeletonCountdown = () => (
    <div className="flex justify-center space-x-4">
        {Array(4).fill().map((_, i) => (
            <div key={i} className="text-center">
                <SkeletonPulse className="block h-16 w-16 rounded p-2 mb-1" />
                <SkeletonPulse className="h-4 w-12 mx-auto" />
            </div>
        ))}
    </div>
);