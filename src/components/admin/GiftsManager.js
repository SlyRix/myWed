import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mdiPlus, mdiPencil, mdiTrashCan, mdiChevronDown, mdiChevronUp, mdiClose } from '@mdi/js';
import Icon from '@mdi/react';
import { fetchGifts, createGift, updateGift, deleteGift, fetchGiftContributions } from '../../api/giftsApi';
import ConfirmDialog from '../common/ConfirmDialog';

/**
 * GiftsManager Component
 * Admin interface for managing gifts and viewing contributions
 */
const GiftsManager = () => {
    const [gifts, setGifts] = useState([]);
    const [expandedGift, setExpandedGift] = useState(null);
    const [contributions, setContributions] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGift, setEditingGift] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, gift: null });

    const [formData, setFormData] = useState({
        nameEn: '',
        nameDe: '',
        nameTa: '',
        descriptionEn: '',
        descriptionDe: '',
        descriptionTa: '',
        price: '',
        imageUrl: '',
        category: 'kitchen',
        productUrl: ''
    });

    useEffect(() => {
        loadGifts();
    }, []);

    const loadGifts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const giftsData = await fetchGifts();
            setGifts(giftsData);
        } catch (err) {
            console.error('Error loading gifts:', err);
            setError('Failed to load gifts');
        } finally {
            setIsLoading(false);
        }
    };

    const loadContributions = async (giftId) => {
        try {
            const contributionsData = await fetchGiftContributions(giftId);
            setContributions(prev => ({
                ...prev,
                [giftId]: contributionsData
            }));
        } catch (err) {
            console.error('Error loading contributions:', err);
        }
    };

    const handleToggleExpand = async (giftId) => {
        if (expandedGift === giftId) {
            setExpandedGift(null);
        } else {
            setExpandedGift(giftId);
            if (!contributions[giftId]) {
                await loadContributions(giftId);
            }
        }
    };

    const handleAddGift = () => {
        setEditingGift(null);
        setFormData({
            nameEn: '',
            nameDe: '',
            nameTa: '',
            descriptionEn: '',
            descriptionDe: '',
            descriptionTa: '',
            price: '',
            imageUrl: '',
            category: 'kitchen',
            productUrl: ''
        });
        setIsModalOpen(true);
    };

    const handleEditGift = (gift) => {
        setEditingGift(gift);
        setFormData({
            nameEn: gift.names.en,
            nameDe: gift.names.de,
            nameTa: gift.names.ta,
            descriptionEn: gift.descriptions.en,
            descriptionDe: gift.descriptions.de,
            descriptionTa: gift.descriptions.ta,
            price: gift.price.toString(),
            imageUrl: gift.imageUrl,
            category: gift.category,
            productUrl: gift.productUrl || ''
        });
        setIsModalOpen(true);
    };

    const handleDeleteGift = (gift) => {
        setDeleteConfirm({
            isOpen: true,
            gift: gift
        });
    };

    const confirmDeleteGift = async () => {
        try {
            await deleteGift(deleteConfirm.gift.id);
            await loadGifts();
        } catch (err) {
            console.error('Error deleting gift:', err);
            setError('Failed to delete gift');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const giftData = {
                names: {
                    en: formData.nameEn,
                    de: formData.nameDe,
                    ta: formData.nameTa
                },
                descriptions: {
                    en: formData.descriptionEn,
                    de: formData.descriptionDe,
                    ta: formData.descriptionTa
                },
                price: parseFloat(formData.price),
                imageUrl: formData.imageUrl,
                category: formData.category,
                productUrl: formData.productUrl || null
            };

            if (editingGift) {
                await updateGift(editingGift.id, giftData);
            } else {
                await createGift(giftData);
            }

            setIsModalOpen(false);
            await loadGifts();
        } catch (err) {
            console.error('Error saving gift:', err);
            setError(err.message || 'Failed to save gift');
        }
    };

    const handleExportCSV = () => {
        const csvData = [];
        csvData.push(['Gift', 'Price', 'Contributed', 'Remaining', 'Percentage', 'Contributors']);

        gifts.forEach(gift => {
            const giftContributions = contributions[gift.id] || [];
            const contributorNames = giftContributions.map(c => c.contributor_name).join('; ');
            csvData.push([
                gift.names.en,
                gift.price.toFixed(2),
                gift.totalContributed.toFixed(2),
                gift.remainingAmount.toFixed(2),
                `${gift.percentageFunded}%`,
                contributorNames || 'None'
            ]);
        });

        const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gift-registry-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-christian-accent"></div>
                <p className="ml-4 text-gray-600">Loading gifts...</p>
            </div>
        );
    }

    return (
        <div>
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gift Registry Management</h2>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={handleAddGift}
                        className="px-4 py-2 bg-gradient-to-r from-christian-accent to-hindu-secondary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
                    >
                        <Icon path={mdiPlus} size={0.8} className="mr-1" />
                        Add Gift
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {gifts.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No gifts added yet. Create your first gift using the button above.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {gifts.map((gift) => (
                            <div key={gift.id} className="p-4">
                                <div className="flex items-start gap-4">
                                    <img
                                        src={gift.imageUrl}
                                        alt={gift.names.en}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {gift.names.en}
                                                </h3>
                                                <p className="text-sm text-gray-600">{gift.category}</p>
                                                {gift.productUrl && (
                                                    <a
                                                        href={gift.productUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-indigo-600 hover:text-indigo-800 inline-flex items-center mt-1"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Product Link ↗
                                                    </a>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditGift(gift)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                    title="Edit Gift"
                                                >
                                                    <Icon path={mdiPencil} size={0.8} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGift(gift)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete Gift"
                                                >
                                                    <Icon path={mdiTrashCan} size={0.8} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 mb-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Price</p>
                                                <p className="font-semibold">CHF {gift.price.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Contributed</p>
                                                <p className="font-semibold text-green-600">CHF {gift.totalContributed.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Remaining</p>
                                                <p className="font-semibold text-orange-600">CHF {gift.remainingAmount.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Progress</p>
                                                <p className="font-semibold">{gift.percentageFunded}%</p>
                                            </div>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                            <div
                                                className="h-full bg-gradient-to-r from-christian-accent to-hindu-secondary rounded-full"
                                                style={{ width: `${Math.min(gift.percentageFunded, 100)}%` }}
                                            />
                                        </div>

                                        {gift.contributionCount > 0 && (
                                            <button
                                                onClick={() => handleToggleExpand(gift.id)}
                                                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                                            >
                                                <Icon
                                                    path={expandedGift === gift.id ? mdiChevronUp : mdiChevronDown}
                                                    size={0.7}
                                                    className="mr-1"
                                                />
                                                {gift.contributionCount} contribution{gift.contributionCount !== 1 ? 's' : ''}
                                            </button>
                                        )}

                                        <AnimatePresence>
                                            {expandedGift === gift.id && contributions[gift.id] && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-4 overflow-hidden"
                                                >
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h4 className="font-semibold mb-3 text-sm text-gray-700">Contributors:</h4>
                                                        <div className="space-y-2">
                                                            {contributions[gift.id].map((contribution) => (
                                                                <div key={contribution.id} className="flex justify-between items-start text-sm">
                                                                    <div>
                                                                        <p className="font-medium">{contribution.contributor_name}</p>
                                                                        {contribution.message && (
                                                                            <p className="text-gray-600 text-xs italic mt-1">
                                                                                "{contribution.message}"
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <p className="font-semibold text-green-600">
                                                                        CHF {contribution.amount.toFixed(2)}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Gift Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 z-50"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                                <h3 className="text-xl font-semibold">
                                    {editingGift ? 'Edit Gift' : 'Add New Gift'}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                    aria-label="Close"
                                >
                                    <Icon path={mdiClose} size={1} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name (English) *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nameEn}
                                            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name (German) *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nameDe}
                                            onChange={(e) => setFormData({ ...formData, nameDe: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name (Tamil) *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nameTa}
                                            onChange={(e) => setFormData({ ...formData, nameTa: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description (English) *
                                        </label>
                                        <textarea
                                            value={formData.descriptionEn}
                                            onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                            rows="3"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent resize-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description (German) *
                                        </label>
                                        <textarea
                                            value={formData.descriptionDe}
                                            onChange={(e) => setFormData({ ...formData, descriptionDe: e.target.value })}
                                            rows="3"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent resize-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description (Tamil) *
                                        </label>
                                        <textarea
                                            value={formData.descriptionTa}
                                            onChange={(e) => setFormData({ ...formData, descriptionTa: e.target.value })}
                                            rows="3"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent resize-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price (CHF) *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category *
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent"
                                            required
                                        >
                                            <option value="experience">Experience</option>
                                            <option value="kitchen">Kitchen</option>
                                            <option value="home">Home</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Image URL *
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent"
                                            placeholder="https://..."
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product URL (optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.productUrl}
                                        onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent"
                                        placeholder="https://amazon.com/... (optional link where guests can buy directly)"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Link to external store where guests can purchase this gift directly
                                    </p>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-gradient-to-r from-christian-accent to-hindu-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        {editingGift ? 'Update Gift' : 'Add Gift'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, gift: null })}
                onConfirm={confirmDeleteGift}
                title="Delete Gift"
                message={`Are you sure you want to delete ${deleteConfirm.gift?.names.en}? This will also delete all contributions to this gift. This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default GiftsManager;
