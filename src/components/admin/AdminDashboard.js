// src/components/admin/AdminDashboard.js
import React, { useState } from 'react';
import QRCodeGenerator from './QRCodeGenerator';
import { guestList } from '../../data/guestAccess';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('qrCodes');

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">Wedding Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 ${activeTab === 'qrCodes' ? 'border-b-2 border-christian-accent font-bold' : ''}`}
                    onClick={() => setActiveTab('qrCodes')}
                >
                    QR Code Generator
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'guestList' ? 'border-b-2 border-christian-accent font-bold' : ''}`}
                    onClick={() => setActiveTab('guestList')}
                >
                    Guest List
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'qrCodes' && <QRCodeGenerator />}

            {activeTab === 'guestList' && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 border">Code</th>
                            <th className="py-2 px-4 border">Name</th>
                            <th className="py-2 px-4 border">Ceremonies</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(guestList).map(([code, guest]) => (
                            <tr key={code}>
                                <td className="py-2 px-4 border">{code}</td>
                                <td className="py-2 px-4 border">{guest.name}</td>
                                <td className="py-2 px-4 border">
                                    {guest.ceremonies.map(c =>
                                        c === 'christian' ? 'Christian' : 'Hindu'
                                    ).join(', ')}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;