// src/components/admin/AdminDashboard.js
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { mdiCross, mdiTempleHindu, mdiQrcode, mdiAccountMultiple, mdiGift, mdiFileEdit } from '@mdi/js';
import Icon from '@mdi/react';
import GiftsManager from './GiftsManager';
import PageContentEditor from './PageContentEditor';
import { QR_CODE_SIZE, QR_CODE_ERROR_CORRECTION_LEVEL, QR_CODE_MARGIN } from '../../constants';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('codes');
    const [selectedGuest, setSelectedGuest] = useState('');
    const [error, setError] = useState(null);
    const [selectedPage, setSelectedPage] = useState('christian-ceremony');

    // Fixed invitation codes for ceremony access
    const INVITATION_CODES = {
        'HINDU': {
            name: 'Hindu Ceremony Guest',
            ceremonies: ['hindu'],
            description: 'Grants access to Hindu ceremony only'
        },
        'CHRISTIAN': {
            name: 'Christian Ceremony Guest',
            ceremonies: ['christian'],
            description: 'Grants access to Christian ceremony only'
        },
        'ALL': {
            name: 'All Ceremonies Guest',
            ceremonies: ['christian', 'hindu'],
            description: 'Grants access to both Hindu and Christian ceremonies'
        }
    };

    // Create invitation URL for QR code
    const getInvitationUrl = (code) => {
        // Use window.location.origin to get the base URL of the current site
        return `${window.location.origin}?code=${code}`;
    };

    return (
        <div className="container mx-auto pt-24 pb-12 px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left">Wedding Admin Dashboard</h1>

            {error && (
                <div role="alert" aria-live="polite" className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Tabs - Improved mobile design */}
            <div className="flex justify-center md:justify-start border-b mb-6 overflow-x-auto">
                <button
                    className={`py-2 px-4 flex items-center whitespace-nowrap ${activeTab === 'codes' ? 'border-b-2 border-christian-accent font-bold' : ''}`}
                    onClick={() => setActiveTab('codes')}
                >
                    <Icon path={mdiAccountMultiple} size={0.8} className="mr-1 hidden sm:inline" />
                    Invitation Codes
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

            {/* Invitation Codes Display */}
            {activeTab === 'codes' && (
                <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Invitation Codes</h2>
                    <p className="text-gray-600 mb-6">
                        Share these codes with guests via email, WhatsApp, or printed invitations. Each code grants access to specific ceremonies.
                    </p>

                    <div className="space-y-6">
                        {/* HINDU Code Card */}
                        <div className="border-l-4 border-hindu-secondary p-6 bg-orange-50 rounded-r-lg">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex-grow">
                                    <div className="flex items-center mb-2">
                                        <Icon path={mdiTempleHindu} size={1.2} className="mr-2 text-hindu-secondary" />
                                        <h3 className="text-xl font-bold text-gray-900">HINDU</h3>
                                    </div>
                                    <p className="text-gray-700 mb-3">{INVITATION_CODES.HINDU.description}</p>
                                    <div className="bg-white p-3 rounded-lg border border-orange-200 inline-block">
                                        <code className="text-sm text-gray-800 font-mono">
                                            {window.location.origin}?code=HINDU
                                        </code>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}?code=HINDU`)
                                            .then(() => alert('Link copied to clipboard!'))
                                            .catch(() => setError('Failed to copy link'));
                                    }}
                                    className="px-4 py-2 bg-hindu-secondary text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>

                        {/* CHRISTIAN Code Card */}
                        <div className="border-l-4 border-christian-accent p-6 bg-blue-50 rounded-r-lg">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex-grow">
                                    <div className="flex items-center mb-2">
                                        <Icon path={mdiCross} size={1.2} className="mr-2 text-christian-accent" />
                                        <h3 className="text-xl font-bold text-gray-900">CHRISTIAN</h3>
                                    </div>
                                    <p className="text-gray-700 mb-3">{INVITATION_CODES.CHRISTIAN.description}</p>
                                    <div className="bg-white p-3 rounded-lg border border-blue-200 inline-block">
                                        <code className="text-sm text-gray-800 font-mono">
                                            {window.location.origin}?code=CHRISTIAN
                                        </code>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}?code=CHRISTIAN`)
                                            .then(() => alert('Link copied to clipboard!'))
                                            .catch(() => setError('Failed to copy link'));
                                    }}
                                    className="px-4 py-2 bg-christian-accent text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>

                        {/* ALL Code Card */}
                        <div className="border-l-4 border-wedding-love p-6 bg-purple-50 rounded-r-lg">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex-grow">
                                    <div className="flex items-center mb-2">
                                        <Icon path={mdiAccountMultiple} size={1.2} className="mr-2 text-wedding-love" />
                                        <h3 className="text-xl font-bold text-gray-900">ALL</h3>
                                    </div>
                                    <p className="text-gray-700 mb-3">{INVITATION_CODES.ALL.description}</p>
                                    <div className="bg-white p-3 rounded-lg border border-purple-200 inline-block">
                                        <code className="text-sm text-gray-800 font-mono">
                                            {window.location.origin}?code=ALL
                                        </code>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}?code=ALL`)
                                            .then(() => alert('Link copied to clipboard!'))
                                            .catch(() => setError('Failed to copy link'));
                                    }}
                                    className="px-4 py-2 bg-wedding-love text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-lg mb-3 flex items-center">
                            <Icon path={mdiFileEdit} size={0.9} className="mr-2" />
                            Important Notes
                        </h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Reception is fully public - no code required</li>
                            <li>Codes are case-insensitive (HINDU = hindu = Hindu)</li>
                            <li>Share links directly or generate QR codes in the QR Codes tab</li>
                            <li>Each guest only needs one code - choose based on which ceremony they're invited to</li>
                        </ul>
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
                        <label className="block mb-2 font-medium">Select Invitation Type:</label>
                        <select
                            value={selectedGuest}
                            onChange={(e) => setSelectedGuest(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg text-base"
                        >
                            <option value="">-- Select invitation type --</option>
                            <option value="HINDU">Hindu Ceremony Only</option>
                            <option value="CHRISTIAN">Christian Ceremony Only</option>
                            <option value="ALL">All Ceremonies</option>
                        </select>
                    </div>

                    {selectedGuest && (
                        <div className="text-center">
                            <div className="mb-4 p-4 inline-block bg-white rounded-lg border border-gray-200">
                                <QRCodeCanvas
                                    id="qr-code"
                                    value={getInvitationUrl(selectedGuest)}
                                    size={QR_CODE_SIZE}
                                    level={QR_CODE_ERROR_CORRECTION_LEVEL}
                                    includeMargin={QR_CODE_MARGIN}
                                    fgColor="#333333"
                                />
                            </div>

                            <div className="space-y-4">
                                <p className="mb-2 text-base"><strong>Code:</strong> {selectedGuest}</p>
                                <p className="mb-2 text-sm text-gray-600">
                                    {selectedGuest === 'HINDU' && 'Hindu ceremony access'}
                                    {selectedGuest === 'CHRISTIAN' && 'Christian ceremony access'}
                                    {selectedGuest === 'ALL' && 'All ceremonies access'}
                                </p>

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
                                            if (process.env.NODE_ENV === 'development') {
                                                console.error('Error downloading QR code:', error);
                                            }
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
        </div>
    );
};

export default AdminDashboard;