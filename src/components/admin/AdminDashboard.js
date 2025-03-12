// src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { mdiPlus, mdiContentSave, mdiTrashCan, mdiCross, mdiTempleHindu, mdiPencil } from '@mdi/js';
import Icon from '@mdi/react';
import { fetchAllGuests, saveGuest, deleteGuest, generateGuestCode } from '../../api/guestApi';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('guestList');
    const [guestList, setGuestList] = useState({});
    const [selectedGuest, setSelectedGuest] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

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
            alert('Please enter a guest name');
            return;
        }

        // Create ceremonies array based on checkboxes
        const ceremonies = [];
        if (formData.christianAccess) ceremonies.push('christian');
        if (formData.hinduAccess) ceremonies.push('hindu');

        if (ceremonies.length === 0) {
            alert('Please select at least one ceremony');
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
    };

    // Delete guest
    const handleDeleteGuest = async (code) => {
        if (window.confirm(`Are you sure you want to delete ${guestList[code].name}?`)) {
            try {
                await deleteGuest(code);

                // Update local state
                const updatedGuestList = { ...guestList };
                delete updatedGuestList[code];
                setGuestList(updatedGuestList);

                // If we're deleting the guest we're currently editing, reset the form
                if (editingGuest === code) {
                    resetForm();
                }
            } catch (error) {
                console.error('Error deleting guest:', error);
                alert('Failed to delete guest. Please try again.');
            }
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
            <div className="container mx-auto py-12 px-4 text-center">
                <h1 className="text-3xl font-bold mb-6">Wedding Admin Dashboard</h1>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-christian-accent"></div>
                </div>
                <p className="text-gray-600">Loading guest list...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">Wedding Admin Dashboard</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 ${activeTab === 'guestList' ? 'border-b-2 border-christian-accent font-bold' : ''}`}
                    onClick={() => setActiveTab('guestList')}
                >
                    Guest List Management
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'qrCodes' ? 'border-b-2 border-christian-accent font-bold' : ''}`}
                    onClick={() => setActiveTab('qrCodes')}
                >
                    QR Code Generator
                </button>
            </div>

            {/* Guest List Management */}
            {activeTab === 'guestList' && (
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Add/Edit Guest Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
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
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-christian-accent"
                                    placeholder="Enter guest name"
                                    required
                                    disabled={isSaving}
                                />
                            </div>

                            <div className="mb-6">
                                <p className="block text-gray-700 mb-2">Ceremonies Access</p>
                                <div className="flex flex-col space-y-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            name="christianAccess"
                                            checked={formData.christianAccess}
                                            onChange={handleInputChange}
                                            className="form-checkbox h-5 w-5 text-christian-accent"
                                            disabled={isSaving}
                                        />
                                        <span className="ml-2 flex items-center">
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
                                        <span className="ml-2 flex items-center">
                                            <Icon path={mdiTempleHindu} size={0.8} className="mr-1 text-hindu-secondary" />
                                            Hindu Ceremony
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-christian-accent to-hindu-secondary text-white rounded-md hover:opacity-90 flex items-center"
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
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Guest List */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Guest List</h2>

                        {Object.keys(guestList).length === 0 ? (
                            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                                No guests added yet. Add your first guest using the form.
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Code
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ceremonies
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {Object.entries(guestList).map(([code, guest]) => (
                                            <tr key={code} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 font-mono">{code}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        {guest.ceremonies.includes('christian') && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    <Icon path={mdiCross} size={0.6} className="mr-1" />
                                                                    Christian
                                                                </span>
                                                        )}
                                                        {guest.ceremonies.includes('hindu') && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                                    <Icon path={mdiTempleHindu} size={0.6} className="mr-1" />
                                                                    Hindu
                                                                </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditGuest(code)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Edit Guest"
                                                        >
                                                            <Icon path={mdiPencil} size={0.8} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteGuest(code)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Delete Guest"
                                                        >
                                                            <Icon path={mdiTrashCan} size={0.8} />
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

            {/* QR Code Generator */}
            {activeTab === 'qrCodes' && (
                <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">QR Code Generator</h2>

                    <div className="mb-4">
                        <label className="block mb-2">Select Guest:</label>
                        <select
                            value={selectedGuest}
                            onChange={(e) => setSelectedGuest(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">-- Select a guest --</option>
                            {Object.entries(guestList).map(([code, guest]) => (
                                <option key={code} value={code}>
                                    {guest.name} - {code} - {guest.ceremonies.join(', ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedGuest && (
                        <div className="text-center">
                            <div className="mb-4 p-4 inline-block bg-white rounded-lg">
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
                                <p className="mb-2">Invitation Code: <strong>{selectedGuest}</strong></p>
                                <p className="mb-2">Guest: <strong>{guestList[selectedGuest].name}</strong></p>

                                {/* Direct invitation link section */}
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                                    <p className="text-sm font-medium mb-2">Direct Invitation Link:</p>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={getInvitationUrl(selectedGuest)}
                                            readOnly
                                            className="flex-grow p-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none"
                                        />
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(getInvitationUrl(selectedGuest));
                                                alert("Link copied to clipboard!");
                                            }}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        You can share this link directly via email or messaging apps.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        const canvas = document.getElementById('qr-code');
                                        const pngUrl = canvas
                                            .toDataURL('image/png')
                                            .replace('image/png', 'image/octet-stream');
                                        const downloadLink = document.createElement('a');
                                        downloadLink.href = pngUrl;
                                        downloadLink.download = `${selectedGuest}-invitation.png`;
                                        document.body.appendChild(downloadLink);
                                        downloadLink.click();
                                        document.body.removeChild(downloadLink);
                                    }}
                                    className="px-4 py-2 bg-christian-accent text-white rounded-lg"
                                >
                                    Download QR Code
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;