// src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { mdiPlus, mdiContentSave, mdiTrashCan, mdiCross, mdiTempleHindu, mdiPencil, mdiQrcode, mdiAccountMultiple, mdiGift, mdiFileEdit } from '@mdi/js';
import Icon from '@mdi/react';
import { fetchAllGuests, saveGuest, deleteGuest, generateGuestCode } from '../../api/guestApi';
import ConfirmDialog from '../common/ConfirmDialog';
import GiftsManager from './GiftsManager';
import PageContentEditor from './PageContentEditor';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('guestList');
    const [guestList, setGuestList] = useState({});
    const [selectedGuest, setSelectedGuest] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, guestCode: null, guestName: '' });
    const [selectedPage, setSelectedPage] = useState('christian-ceremony');

    // Form state for adding/editing guests
    const [formData, setFormData] = useState({
        name: '',
        christianAccess: false,
        hinduAccess: false
    });

    // Load guest list from API on component mount
    useEffect(() => {
        const loadGuests = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const guests = await fetchAllGuests();
                setGuestList(guests);
            } catch (error) {
                console.error('Error loading guests:', error);
                setError('Failed to load guest list. Please check your connection and try again.');
            } finally {
                setIsLoading(false);
            }
        };

        loadGuests();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Please enter a guest name');
            return;
        }

        // Create ceremonies array based on checkboxes
        const ceremonies = [];
        if (formData.christianAccess) ceremonies.push('christian');
        if (formData.hinduAccess) ceremonies.push('hindu');

        if (ceremonies.length === 0) {
            setError('Please select at least one ceremony');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            if (isEditing && editingGuest) {
                // Update existing guest
                const guestData = {
                    name: formData.name,
                    ceremonies
                };

                await saveGuest(editingGuest, guestData);

                // Update local state
                setGuestList(prev => ({
                    ...prev,
                    [editingGuest]: guestData
                }));

                resetForm();
            } else {
                // Add new guest - generate code
                const guestCode = await generateGuestCode(formData.name);

                const guestData = {
                    name: formData.name,
                    ceremonies
                };

                await saveGuest(guestCode, guestData);

                // Update local state
                setGuestList(prev => ({
                    ...prev,
                    [guestCode]: guestData
                }));

                resetForm();
            }
        } catch (error) {
            console.error('Error saving guest:', error);
            setError('Failed to save guest. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Reset form and editing state
    const resetForm = () => {
        setFormData({
            name: '',
            christianAccess: false,
            hinduAccess: false
        });
        setIsEditing(false);
        setEditingGuest(null);
    };

    // Edit guest
    const handleEditGuest = (code) => {
        const guest = guestList[code];
        setFormData({
            name: guest.name,
            christianAccess: guest.ceremonies.includes('christian'),
            hinduAccess: guest.ceremonies.includes('hindu')
        });
        setIsEditing(true);
        setEditingGuest(code);

        // On mobile, scroll to the form when editing
        if (window.innerWidth < 768) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Delete guest - shows confirmation dialog
    const handleDeleteGuest = (code) => {
        setDeleteConfirm({
            isOpen: true,
            guestCode: code,
            guestName: guestList[code].name
        });
    };

    // Confirm delete guest
    const confirmDeleteGuest = async () => {
        const { guestCode } = deleteConfirm;

        try {
            await deleteGuest(guestCode);

            // Update local state
            const updatedGuestList = { ...guestList };
            delete updatedGuestList[guestCode];
            setGuestList(updatedGuestList);

            // If we're deleting the guest we're currently editing, reset the form
            if (editingGuest === guestCode) {
                resetForm();
            }
        } catch (error) {
            console.error('Error deleting guest:', error);
            setError('Failed to delete guest. Please try again.');
        }
    };

    // Create invitation URL for QR code
    const getInvitationUrl = (code) => {
        // Use window.location.origin to get the base URL of the current site
        return `${window.location.origin}?code=${code}`;
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="container mx-auto pt-24 pb-12 px-4 text-center">
                <h1 className="text-2xl md:text-3xl font-bold mb-6">Wedding Admin Dashboard</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-christian-accent"></div>
                </div>
                <p className="text-gray-600">Loading guest list...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto pt-24 pb-12 px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left">Wedding Admin Dashboard</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Tabs - Improved mobile design */}
            <div className="flex justify-center md:justify-start border-b mb-6 overflow-x-auto">
                <button
                    className={`py-2 px-4 flex items-center whitespace-nowrap ${activeTab === 'guestList' ? 'border-b-2 border-christian-accent font-bold' : ''}`}
                    onClick={() => setActiveTab('guestList')}
                >
                    <Icon path={mdiAccountMultiple} size={0.8} className="mr-1 hidden sm:inline" />
                    Guest List
                </button>
                <button
                    className={`py-2 px-4 flex items-center whitespace-nowrap ${activeTab === 'gifts' ? 'border-b-2 border-christian-accent font-bold' : ''}`}
                    onClick={() => setActiveTab('gifts')}
                >
                    <Icon path={mdiGift} size={0.8} className="mr-1 hidden sm:inline" />
                    Gifts
                </button>
                <button
                    className={`py-2 px-4 flex items-center whitespace-nowrap ${activeTab === 'content' ? 'border-b-2 border-christian-accent font-bold' : ''}`}
                    onClick={() => setActiveTab('content')}
                >
                    <Icon path={mdiFileEdit} size={0.8} className="mr-1 hidden sm:inline" />
                    Content
                </button>
                <button
                    className={`py-2 px-4 flex items-center whitespace-nowrap ${activeTab === 'qrCodes' ? 'border-b-2 border-christian-accent font-bold' : ''}`}
                    onClick={() => setActiveTab('qrCodes')}
                >
                    <Icon path={mdiQrcode} size={0.8} className="mr-1 hidden sm:inline" />
                    QR Codes
                </button>
            </div>

            {/* Guest List Management - Mobile optimized */}
            {activeTab === 'guestList' && (
                <div className="space-y-8 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                    {/* Add/Edit Guest Form */}
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditing ? 'Edit Guest' : 'Add New Guest'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="name">
                                    Guest Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-christian-accent"
                                    placeholder="Enter guest name"
                                    required
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="mb-6">
                                <p className="block text-gray-700 mb-2">Ceremonies Access</p>
                                <div className="flex flex-col space-y-3">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="christianAccess"
                                            checked={formData.christianAccess}
                                            onChange={handleInputChange}
                                            className="form-checkbox h-5 w-5 text-christian-accent"
                                            disabled={isSaving}
                                        />
                                        <span className="ml-2 flex items-center text-base">
                                            <Icon path={mdiCross} size={0.8} className="mr-1 text-christian-accent" />
                                            Christian Ceremony
                                        </span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="hinduAccess"
                                            checked={formData.hinduAccess}
                                            onChange={handleInputChange}
                                            className="form-checkbox h-5 w-5 text-hindu-secondary"
                                            disabled={isSaving}
                                        />
                                        <span className="ml-2 flex items-center text-base">
                                            <Icon path={mdiTempleHindu} size={0.8} className="mr-1 text-hindu-secondary" />
                                            Hindu Ceremony
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    className="px-4 py-3 bg-gradient-to-r from-christian-accent to-hindu-secondary text-white rounded-md hover:opacity-90 flex items-center"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                            {isEditing ? 'Updating...' : 'Adding...'}
                                        </>
                                    ) : (
                                        <>
                                            <Icon path={isEditing ? mdiContentSave : mdiPlus} size={0.8} className="mr-1" />
                                            {isEditing ? 'Update Guest' : 'Add Guest'}
                                        </>
                                    )}
                                </button>

                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Guest List - Mobile optimized */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Guest List</h2>

                        {Object.keys(guestList).length === 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                                No guests added yet. Add your first guest using the form.
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="w-full">
                                    <table className="w-full table-fixed divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="w-2/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="w-1/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Code
                                            </th>
                                            <th className="w-1/5 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Access
                                            </th>
                                            <th className="w-1/5 px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {Object.entries(guestList).map(([code, guest]) => (
                                            <tr key={code} className="hover:bg-gray-50">
                                                <td className="px-3 py-3 text-sm">
                                                    <div className="font-medium text-gray-900 truncate">
                                                        {guest.name}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3 text-sm">
                                                    <div className="text-gray-900 font-mono truncate">{code}</div>
                                                </td>
                                                <td className="px-3 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {guest.ceremonies.includes('christian') && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                <Icon path={mdiCross} size={0.5} className="mr-1" />
                                                                <span className="hidden sm:inline">Christian</span>
                                                                <span className="sm:hidden">C</span>
                                                            </span>
                                                        )}
                                                        {guest.ceremonies.includes('hindu') && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                                <Icon path={mdiTempleHindu} size={0.5} className="mr-1" />
                                                                <span className="hidden sm:inline">Hindu</span>
                                                                <span className="sm:hidden">H</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3 text-right">
                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            onClick={() => handleEditGuest(code)}
                                                            className="text-indigo-600 hover:text-indigo-900 p-1"
                                                            title="Edit Guest"
                                                        >
                                                            <Icon path={mdiPencil} size={0.9} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteGuest(code)}
                                                            className="text-red-600 hover:text-red-900 p-1"
                                                            title="Delete Guest"
                                                        >
                                                            <Icon path={mdiTrashCan} size={0.9} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Gift Registry Management */}
            {activeTab === 'gifts' && (
                <GiftsManager />
            )}

            {/* Page Content Management */}
            {activeTab === 'content' && (
                <div className="space-y-6">
                    {/* Page selector */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <label className="block text-gray-700 font-medium mb-3">Select Page to Edit:</label>
                        <select
                            value={selectedPage}
                            onChange={(e) => setSelectedPage(e.target.value)}
                            className="w-full md:w-auto p-3 border border-gray-300 rounded-lg text-base"
                        >
                            <option value="christian-ceremony">Christian Ceremony</option>
                            <option value="hindu-ceremony">Hindu Ceremony</option>
                            <option value="reception">Reception</option>
                            <option value="our-story">Our Story</option>
                            <option value="home">Home Page</option>
                        </select>
                    </div>

                    {/* Content editor */}
                    <PageContentEditor
                        key={selectedPage}
                        pageId={selectedPage}
                        pageTitle={selectedPage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    />
                </div>
            )}

            {/* QR Code Generator - Mobile optimized */}
            {activeTab === 'qrCodes' && (
                <div className="p-4 md:p-6 mx-auto bg-white rounded-lg shadow-md max-w-md">
                    <h2 className="text-xl font-bold mb-6 text-center">QR Code Generator</h2>

                    <div className="mb-6">
                        <label className="block mb-2 font-medium">Select Guest:</label>
                        <select
                            value={selectedGuest}
                            onChange={(e) => setSelectedGuest(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-base"
                        >
                            <option value="">-- Select a guest --</option>
                            {Object.entries(guestList).map(([code, guest]) => (
                                <option key={code} value={code}>
                                    {guest.name} - {code}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedGuest && (
                        <div className="text-center">
                            <div className="mb-4 p-4 inline-block bg-white rounded-lg border border-gray-200">
                                <QRCodeCanvas
                                    id="qr-code"
                                    value={getInvitationUrl(selectedGuest)}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                    fgColor="#333333"
                                />
                            </div>

                            <div className="space-y-4">
                                <p className="mb-2 text-base">Invitation Code: <strong>{selectedGuest}</strong></p>
                                <p className="mb-2 text-base">Guest: <strong>{guestList[selectedGuest].name}</strong></p>

                                {/* Direct invitation link section */}
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                                    <p className="text-sm font-medium mb-3">Direct Invitation Link:</p>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="text"
                                            value={getInvitationUrl(selectedGuest)}
                                            readOnly
                                            className="flex-grow p-3 text-sm border border-gray-300 rounded-lg sm:rounded-r-none focus:outline-none"
                                        />
                                        <button
                                            onClick={(e) => {
                                                navigator.clipboard.writeText(getInvitationUrl(selectedGuest))
                                                    .then(() => {
                                                        // Visual feedback instead of alert
                                                        const btn = e.target;
                                                        const originalText = btn.textContent;
                                                        btn.textContent = 'Copied!';
                                                        btn.classList.add('bg-green-500', 'text-white');
                                                        setTimeout(() => {
                                                            btn.textContent = originalText;
                                                            btn.classList.remove('bg-green-500', 'text-white');
                                                        }, 2000);
                                                    })
                                                    .catch(() => setError('Failed to copy link'));
                                            }}
                                            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg sm:rounded-l-none hover:bg-gray-300 text-base transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Share this link via email or messaging apps.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        try {
                                            const qrElement = document.getElementById('qr-code');

                                            if (!qrElement) {
                                                setError('QR code not found. Please generate a QR code first.');
                                                return;
                                            }

                                            const canvas = qrElement.querySelector('canvas');

                                            if (!canvas) {
                                                setError('Unable to generate QR code image. Please try again.');
                                                return;
                                            }

                                            const pngUrl = canvas.toDataURL('image/png');
                                            const downloadLink = document.createElement('a');
                                            downloadLink.href = pngUrl;
                                            downloadLink.download = `${selectedGuest}-invitation.png`;
                                            document.body.appendChild(downloadLink);
                                            downloadLink.click();
                                            document.body.removeChild(downloadLink);
                                        } catch (error) {
                                            console.error('Error downloading QR code:', error);
                                            setError('Failed to download QR code. Please try again.');
                                        }
                                    }}
                                    className="px-4 py-3 bg-christian-accent text-white rounded-lg w-full sm:w-auto hover:bg-christian-accent/90 transition-colors"
                                >
                                    Download QR Code
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Confirmation Dialog for Deleting Guests */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, guestCode: null, guestName: '' })}
                onConfirm={confirmDeleteGuest}
                title="Delete Guest"
                message={`Are you sure you want to delete ${deleteConfirm.guestName}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
};

export default AdminDashboard;