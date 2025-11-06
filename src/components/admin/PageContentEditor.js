// src/components/admin/PageContentEditor.js
import React, { useState, useEffect } from 'react';
import { mdiContentSave, mdiPlus, mdiDelete, mdiImageEdit, mdiArrowUp, mdiArrowDown } from '@mdi/js';
import Icon from '@mdi/react';
import { getPageContent, updatePageContent } from '../../api/contentApi';
import ImageUploader from './ImageUploader';

/**
 * Page Content Editor Component
 * Allows editing of page content including text, images, and node-based content (timelines, story events)
 */
const PageContentEditor = ({ pageId, pageTitle }) => {
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Load page content on mount
    useEffect(() => {
        loadContent();
    }, [pageId]);

    const loadContent = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getPageContent(pageId);
            setContent(data.content || {});
        } catch (err) {
            setError(`Failed to load content: ${err.message}`);
            setContent({});
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccessMessage('');
        try {
            await updatePageContent(pageId, content);
            setSuccessMessage('Content saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(`Failed to save content: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Update nested content
    const updateContent = (path, value) => {
        setContent(prevContent => {
            const newContent = { ...prevContent };
            const keys = path.split('.');
            let current = newContent;

            // Navigate to parent object
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            // Set value
            current[keys[keys.length - 1]] = value;
            return newContent;
        });
    };

    // Add new item to array (for timeline events, story milestones, etc.)
    const addArrayItem = (arrayPath, defaultItem) => {
        setContent(prevContent => {
            const newContent = { ...prevContent };
            const keys = arrayPath.split('.');
            let current = newContent;

            // Navigate to array
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            const arrayKey = keys[keys.length - 1];
            if (!Array.isArray(current[arrayKey])) {
                current[arrayKey] = [];
            }

            current[arrayKey] = [...current[arrayKey], defaultItem];
            return newContent;
        });
    };

    // Remove item from array
    const removeArrayItem = (arrayPath, index) => {
        setContent(prevContent => {
            const newContent = { ...prevContent };
            const keys = arrayPath.split('.');
            let current = newContent;

            // Navigate to array
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }

            const arrayKey = keys[keys.length - 1];
            current[arrayKey] = current[arrayKey].filter((_, i) => i !== index);
            return newContent;
        });
    };

    // Move array item up or down
    const moveArrayItem = (arrayPath, index, direction) => {
        setContent(prevContent => {
            const newContent = { ...prevContent };
            const keys = arrayPath.split('.');
            let current = newContent;

            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }

            const arrayKey = keys[keys.length - 1];
            const newIndex = direction === 'up' ? index - 1 : index + 1;

            if (newIndex >= 0 && newIndex < current[arrayKey].length) {
                const arr = [...current[arrayKey]];
                [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
                current[arrayKey] = arr;
            }

            return newContent;
        });
    };

    // Update array item
    const updateArrayItem = (arrayPath, index, field, value) => {
        setContent(prevContent => {
            const newContent = { ...prevContent };
            const keys = arrayPath.split('.');
            let current = newContent;

            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }

            const arrayKey = keys[keys.length - 1];
            current[arrayKey] = current[arrayKey].map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            );
            return newContent;
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-christian-accent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{pageTitle}</h2>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-gradient-to-r from-christian-accent to-hindu-secondary text-white rounded-md hover:opacity-90 flex items-center disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Icon path={mdiContentSave} size={0.8} className="mr-2" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Messages */}
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    {successMessage}
                </div>
            )}

            {/* Content Editor - Different for each page */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                {renderPageEditor(pageId, content, {
                    updateContent,
                    addArrayItem,
                    removeArrayItem,
                    moveArrayItem,
                    updateArrayItem
                })}
            </div>
        </div>
    );
};

/**
 * Renders the appropriate editor based on page ID
 */
const renderPageEditor = (pageId, content, handlers) => {
    switch (pageId) {
        case 'christian-ceremony':
        case 'hindu-ceremony':
        case 'reception':
            return renderCeremonyEditor(pageId, content, handlers);
        case 'our-story':
            return renderStoryEditor(content, handlers);
        case 'home':
            return renderHomeEditor(content, handlers);
        default:
            return <div>No editor available for this page</div>;
    }
};

/**
 * Ceremony page editor (Christian, Hindu, Reception)
 */
const renderCeremonyEditor = (pageId, content, { updateContent, addArrayItem, removeArrayItem, moveArrayItem, updateArrayItem }) => {
    const images = content.images || {};
    const timeline = content.timeline || [];
    const rituals = content.rituals || []; // For Hindu ceremony

    return (
        <>
            {/* Hero Image */}
            <ImageUploader
                currentImage={images.hero || ''}
                onImageSelect={(url) => updateContent('images.hero', url)}
                label="Hero Image"
            />

            {/* Timeline Events */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Timeline Events</h3>
                    <button
                        onClick={() => addArrayItem('timeline', { time: '', title: '', description: '' })}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                    >
                        <Icon path={mdiPlus} size={0.8} className="mr-1" />
                        Add Event
                    </button>
                </div>

                <div className="space-y-4">
                    {timeline.map((event, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Event {index + 1}</span>
                                <div className="flex gap-2">
                                    {index > 0 && (
                                        <button
                                            onClick={() => moveArrayItem('timeline', index, 'up')}
                                            className="p-1 text-gray-600 hover:text-gray-800"
                                            title="Move up"
                                        >
                                            <Icon path={mdiArrowUp} size={0.7} />
                                        </button>
                                    )}
                                    {index < timeline.length - 1 && (
                                        <button
                                            onClick={() => moveArrayItem('timeline', index, 'down')}
                                            className="p-1 text-gray-600 hover:text-gray-800"
                                            title="Move down"
                                        >
                                            <Icon path={mdiArrowDown} size={0.7} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => removeArrayItem('timeline', index)}
                                        className="p-1 text-red-600 hover:text-red-800"
                                        title="Delete"
                                    >
                                        <Icon path={mdiDelete} size={0.7} />
                                    </button>
                                </div>
                            </div>

                            <input
                                type="text"
                                value={event.time || ''}
                                onChange={(e) => updateArrayItem('timeline', index, 'time', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Time (e.g., 14:00)"
                            />

                            <input
                                type="text"
                                value={event.title || ''}
                                onChange={(e) => updateArrayItem('timeline', index, 'title', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Event Title"
                            />

                            <textarea
                                value={event.description || ''}
                                onChange={(e) => updateArrayItem('timeline', index, 'description', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Event Description"
                                rows="2"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Hindu Ceremony Rituals */}
            {pageId === 'hindu-ceremony' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Ritual Cards</h3>
                        <button
                            onClick={() => addArrayItem('rituals', { title: '', description: '' })}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                        >
                            <Icon path={mdiPlus} size={0.8} className="mr-1" />
                            Add Ritual
                        </button>
                    </div>

                    <div className="space-y-4">
                        {rituals.map((ritual, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-700">Ritual {index + 1}</span>
                                    <button
                                        onClick={() => removeArrayItem('rituals', index)}
                                        className="p-1 text-red-600 hover:text-red-800"
                                        title="Delete"
                                    >
                                        <Icon path={mdiDelete} size={0.7} />
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    value={ritual.title || ''}
                                    onChange={(e) => updateArrayItem('rituals', index, 'title', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Ritual Title"
                                />

                                <textarea
                                    value={ritual.description || ''}
                                    onChange={(e) => updateArrayItem('rituals', index, 'description', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Ritual Description"
                                    rows="2"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

/**
 * Our Story page editor
 */
const renderStoryEditor = (content, { addArrayItem, removeArrayItem, moveArrayItem, updateArrayItem }) => {
    const timeline = content.timeline || [];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Story Timeline</h3>
                <button
                    onClick={() => addArrayItem('timeline', { date: '', title: '', description: '', image: '' })}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                >
                    <Icon path={mdiPlus} size={0.8} className="mr-1" />
                    Add Milestone
                </button>
            </div>

            <div className="space-y-6">
                {timeline.map((event, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Milestone {index + 1}</span>
                            <div className="flex gap-2">
                                {index > 0 && (
                                    <button
                                        onClick={() => moveArrayItem('timeline', index, 'up')}
                                        className="p-1 text-gray-600 hover:text-gray-800"
                                        title="Move up"
                                    >
                                        <Icon path={mdiArrowUp} size={0.7} />
                                    </button>
                                )}
                                {index < timeline.length - 1 && (
                                    <button
                                        onClick={() => moveArrayItem('timeline', index, 'down')}
                                        className="p-1 text-gray-600 hover:text-gray-800"
                                        title="Move down"
                                    >
                                        <Icon path={mdiArrowDown} size={0.7} />
                                    </button>
                                )}
                                <button
                                    onClick={() => removeArrayItem('timeline', index)}
                                    className="p-1 text-red-600 hover:text-red-800"
                                    title="Delete"
                                >
                                    <Icon path={mdiDelete} size={0.7} />
                                </button>
                            </div>
                        </div>

                        <input
                            type="text"
                            value={event.date || ''}
                            onChange={(e) => updateArrayItem('timeline', index, 'date', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Date (e.g., January 2020)"
                        />

                        <input
                            type="text"
                            value={event.title || ''}
                            onChange={(e) => updateArrayItem('timeline', index, 'title', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Milestone Title"
                        />

                        <textarea
                            value={event.description || ''}
                            onChange={(e) => updateArrayItem('timeline', index, 'description', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Description"
                            rows="2"
                        />

                        <ImageUploader
                            currentImage={event.image || ''}
                            onImageSelect={(url) => updateArrayItem('timeline', index, 'image', url)}
                            label={`Milestone ${index + 1} Image`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Home page editor
 */
const renderHomeEditor = (content, { updateContent }) => {
    const hero = content.hero || {};

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Hero Section</h3>

            <ImageUploader
                currentImage={hero.backgroundImage || ''}
                onImageSelect={(url) => updateContent('hero.backgroundImage', url)}
                label="Background Image (optional)"
            />

            <ImageUploader
                currentImage={hero.patternImage || ''}
                onImageSelect={(url) => updateContent('hero.patternImage', url)}
                label="Pattern Image"
            />
        </div>
    );
};

export default PageContentEditor;
