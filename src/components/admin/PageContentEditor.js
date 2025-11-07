// src/components/admin/PageContentEditor.js
import React, { useState, useEffect } from 'react';
import { mdiContentSave, mdiPlus, mdiDelete, mdiImageEdit, mdiArrowUp, mdiArrowDown, mdiAlert } from '@mdi/js';
import Icon from '@mdi/react';
import { getAllPageContent, updatePageContent, getAvailableLanguages } from '../../api/contentApi';
import ImageUploader from './ImageUploader';

/**
 * Page Content Editor Component with Multi-Language Support
 * Allows editing of page content including text, images, and node-based content (timelines, story events)
 */
const PageContentEditor = ({ pageId, pageTitle }) => {
    const [allContent, setAllContent] = useState({});  // Content for all languages
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [availableLanguages, setAvailableLanguages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
        { code: 'ta', label: 'தமிழ்', flag: '🇱🇰' }
    ];

    // Load page content on mount
    useEffect(() => {
        loadContent();
    }, [pageId]);

    const loadContent = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAllPageContent(pageId);
            const languages = data.languages || {};

            // Extract content from each language
            const contentByLang = {};
            Object.keys(languages).forEach(lang => {
                contentByLang[lang] = languages[lang].content || {};
            });

            setAllContent(contentByLang);
            // All languages have i18n translations, so mark all as available
            setAvailableLanguages(['en', 'de', 'ta']);
            setHasUnsavedChanges(false);
        } catch (err) {
            setError(`Failed to load content: ${err.message}`);
            setAllContent({});
        } finally {
            setIsLoading(false);
        }
    };

    const handleLanguageSwitch = (newLanguage) => {
        if (hasUnsavedChanges) {
            const confirmSwitch = window.confirm(
                'You have unsaved changes. Switching languages will discard them. Continue?'
            );
            if (!confirmSwitch) return;
        }
        setSelectedLanguage(newLanguage);
        setHasUnsavedChanges(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccessMessage('');
        try {
            const currentContent = allContent[selectedLanguage] || {};

            // Save current language content
            await updatePageContent(pageId, selectedLanguage, currentContent);

            // Sync images across all languages (images are language-independent)
            const imagesToSync = extractImagePaths(currentContent);

            if (Object.keys(imagesToSync).length > 0) {
                // Update other languages with the same images
                for (const lang of ['en', 'de', 'ta']) {
                    if (lang !== selectedLanguage && allContent[lang]) {
                        const updatedLangContent = { ...allContent[lang] };
                        applyImagePaths(updatedLangContent, imagesToSync);
                        await updatePageContent(pageId, lang, updatedLangContent);
                    }
                }
            }

            setSuccessMessage(`Content saved successfully for all languages!`);
            setHasUnsavedChanges(false);

            // Update available languages
            if (!availableLanguages.includes(selectedLanguage)) {
                setAvailableLanguages([...availableLanguages, selectedLanguage]);
            }

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(`Failed to save content: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Extract all image paths from content
    const extractImagePaths = (content) => {
        const images = {};

        // Hero/pattern images
        if (content.images) {
            images.images = { ...content.images };
        }
        if (content.hero) {
            images.hero = { ...content.hero };
        }

        // Timeline images
        if (content.timeline && Array.isArray(content.timeline)) {
            images.timelineImages = content.timeline.map(item => item.image || '');
        }

        return images;
    };

    // Apply image paths to content (preserve text, update only images)
    const applyImagePaths = (content, imagePaths) => {
        // Apply hero/pattern images
        if (imagePaths.images && content.images) {
            content.images = { ...content.images, ...imagePaths.images };
        }
        if (imagePaths.hero && content.hero) {
            content.hero = { ...content.hero, ...imagePaths.hero };
        }

        // Apply timeline images
        if (imagePaths.timelineImages && content.timeline && Array.isArray(content.timeline)) {
            content.timeline = content.timeline.map((item, index) => ({
                ...item,
                image: imagePaths.timelineImages[index] || item.image || ''
            }));
        }
    };

    // Update nested content for current language
    const updateContent = (path, value) => {
        setAllContent(prevAllContent => {
            const newAllContent = { ...prevAllContent };
            const langContent = { ...(newAllContent[selectedLanguage] || {}) };
            const keys = path.split('.');
            let current = langContent;

            // Navigate to parent object
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }

            // Set value
            current[keys[keys.length - 1]] = value;
            newAllContent[selectedLanguage] = langContent;
            setHasUnsavedChanges(true);
            return newAllContent;
        });
    };

    // Add new item to array (for timeline events, story milestones, etc.)
    const addArrayItem = (arrayPath, defaultItem) => {
        setAllContent(prevAllContent => {
            const newAllContent = { ...prevAllContent };
            const langContent = { ...(newAllContent[selectedLanguage] || {}) };
            const keys = arrayPath.split('.');
            let current = langContent;

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
            newAllContent[selectedLanguage] = langContent;
            setHasUnsavedChanges(true);
            return newAllContent;
        });
    };

    // Remove item from array
    const removeArrayItem = (arrayPath, index) => {
        setAllContent(prevAllContent => {
            const newAllContent = { ...prevAllContent };
            const langContent = { ...(newAllContent[selectedLanguage] || {}) };
            const keys = arrayPath.split('.');
            let current = langContent;

            // Navigate to array
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }

            const arrayKey = keys[keys.length - 1];
            current[arrayKey] = current[arrayKey].filter((_, i) => i !== index);
            newAllContent[selectedLanguage] = langContent;
            setHasUnsavedChanges(true);
            return newAllContent;
        });
    };

    // Move array item up or down
    const moveArrayItem = (arrayPath, index, direction) => {
        setAllContent(prevAllContent => {
            const newAllContent = { ...prevAllContent };
            const langContent = { ...(newAllContent[selectedLanguage] || {}) };
            const keys = arrayPath.split('.');
            let current = langContent;

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

            newAllContent[selectedLanguage] = langContent;
            setHasUnsavedChanges(true);
            return newAllContent;
        });
    };

    // Update array item
    const updateArrayItem = (arrayPath, index, field, value) => {
        setAllContent(prevAllContent => {
            const newAllContent = { ...prevAllContent };
            const langContent = { ...(newAllContent[selectedLanguage] || {}) };
            const keys = arrayPath.split('.');
            let current = langContent;

            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }

            const arrayKey = keys[keys.length - 1];
            current[arrayKey] = current[arrayKey].map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            );
            newAllContent[selectedLanguage] = langContent;
            setHasUnsavedChanges(true);
            return newAllContent;
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-christian-accent"></div>
            </div>
        );
    }

    const currentContent = allContent[selectedLanguage] || {};

    return (
        <div className="space-y-6">
            {/* Header with Save Button */}
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

            {/* Language Selector */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Language:</span>
                        <div className="flex space-x-2">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageSwitch(lang.code)}
                                    className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                                        selectedLanguage === lang.code
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span>{lang.flag}</span>
                                    <span className="font-medium">{lang.label}</span>
                                    {availableLanguages.includes(lang.code) && (
                                        <span className="text-xs">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {hasUnsavedChanges && (
                        <div className="flex items-center text-amber-600">
                            <Icon path={mdiAlert} size={0.7} className="mr-1" />
                            <span className="text-sm font-medium">Unsaved changes</span>
                        </div>
                    )}
                </div>

                {/* Language Status Indicators */}
                <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium">Content availability:</span>
                    <div className="flex space-x-4 mt-1">
                        {languages.map(lang => (
                            <span key={lang.code} className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-1 ${
                                    availableLanguages.includes(lang.code) ? 'bg-green-500' : 'bg-gray-300'
                                }`}></span>
                                {lang.label}
                            </span>
                        ))}
                    </div>
                </div>
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
                {renderPageEditor(pageId, currentContent, {
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
    const headline = content.headline || '';
    const description = content.description || '';
    const description2 = content.description2 || '';
    const scheduleTitle = content.scheduleTitle || '';
    const ritualsTitle = content.ritualsTitle || '';  // Hindu only
    const ritualsDescription = content.ritualsDescription || '';  // Hindu only

    return (
        <>
            {/* Headline */}
            <div>
                <h3 className="text-lg font-bold mb-2">Page Headline</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Main headline text for the ceremony page.
                </p>
                <input
                    type="text"
                    value={headline}
                    onChange={(e) => updateContent('headline', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter headline..."
                />
            </div>

            {/* Description 1 */}
            <div>
                <h3 className="text-lg font-bold mb-2">First Description Paragraph</h3>
                <p className="text-sm text-gray-600 mb-2">
                    First description paragraph below the headline.
                </p>
                <textarea
                    value={description}
                    onChange={(e) => updateContent('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter first description paragraph..."
                    rows="3"
                />
            </div>

            {/* Description 2 */}
            <div>
                <h3 className="text-lg font-bold mb-2">Second Description Paragraph</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Second description paragraph.
                </p>
                <textarea
                    value={description2}
                    onChange={(e) => updateContent('description2', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter second description paragraph..."
                    rows="3"
                />
            </div>

            {/* Hero Image */}
            <ImageUploader
                currentImage={images.hero || ''}
                onImageSelect={(url) => updateContent('images.hero', url)}
                label="Hero Image"
            />

            {/* Schedule Title */}
            <div>
                <h3 className="text-lg font-bold mb-2">Schedule Section Title</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Title for the timeline/schedule section.
                </p>
                <input
                    type="text"
                    value={scheduleTitle}
                    onChange={(e) => updateContent('scheduleTitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="E.g., 'Ceremony Schedule'"
                />
            </div>

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

            {/* Hindu Ceremony Rituals Section */}
            {pageId === 'hindu-ceremony' && (
                <>
                    {/* Rituals Section Title */}
                    <div>
                        <h3 className="text-lg font-bold mb-2">Rituals Section Title</h3>
                        <p className="text-sm text-gray-600 mb-2">
                            Title for the rituals section.
                        </p>
                        <input
                            type="text"
                            value={ritualsTitle}
                            onChange={(e) => updateContent('ritualsTitle', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md"
                            placeholder="E.g., 'Important Hindu Wedding Rituals'"
                        />
                    </div>

                    {/* Rituals Section Description */}
                    <div>
                        <h3 className="text-lg font-bold mb-2">Rituals Section Description</h3>
                        <p className="text-sm text-gray-600 mb-2">
                            Description text for the rituals section.
                        </p>
                        <textarea
                            value={ritualsDescription}
                            onChange={(e) => updateContent('ritualsDescription', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md"
                            placeholder="Enter rituals section description..."
                            rows="3"
                        />
                    </div>

                    {/* Ritual Cards */}
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
                </>
            )}
        </>
    );
};

/**
 * Our Story page editor
 */
const renderStoryEditor = (content, { updateContent, addArrayItem, removeArrayItem, moveArrayItem, updateArrayItem }) => {
    const timeline = content.timeline || [];
    const headline = content.headline || '';
    const description = content.description || '';

    return (
        <>
            {/* Story Page Headline */}
            <div>
                <h3 className="text-lg font-bold mb-2">Story Page Headline</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Main headline for the Our Story page.
                </p>
                <input
                    type="text"
                    value={headline}
                    onChange={(e) => updateContent('headline', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter story page headline..."
                />
            </div>

            {/* Story Page Description */}
            <div>
                <h3 className="text-lg font-bold mb-2">Story Page Description</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Description text below the headline.
                </p>
                <textarea
                    value={description}
                    onChange={(e) => updateContent('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Enter story page description..."
                    rows="3"
                />
            </div>

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
        </>
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
