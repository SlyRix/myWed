// src/components/admin/QRCodeGenerator.js
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { guestList } from '../../data/guestAccess';

const QRCodeGenerator = () => {
    const [selectedGuest, setSelectedGuest] = useState('');

    // Convert guest list to array for select dropdown
    const guests = Object.entries(guestList).map(([code, guest]) => ({
        code,
        name: guest.name,
        ceremonies: guest.ceremonies
    }));

    const handleDownload = () => {
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
    };

    // Create guest invitation URL
    const getInvitationUrl = (code) => {
        return `https://yourweddingsite.com?code=${code}`;
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">QR Code Generator</h2>

            <div className="mb-4">
                <label className="block mb-2">Select Guest:</label>
                <select
                    value={selectedGuest}
                    onChange={(e) => setSelectedGuest(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                >
                    <option value="">-- Select a guest --</option>
                    {guests.map((guest) => (
                        <option key={guest.code} value={guest.code}>
                            {guest.name} - {guest.code} - {guest.ceremonies.join(', ')}
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
                            onClick={handleDownload}
                            className="px-4 py-2 bg-christian-accent text-white rounded-lg"
                        >
                            Download QR Code
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRCodeGenerator;