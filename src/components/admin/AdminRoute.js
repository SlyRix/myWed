// src/components/admin/AdminRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        // Check if user has admin token
        const token = localStorage.getItem('adminToken');

        if (token && token.length > 0) {
            // Token exists - consider user authenticated
            // In a more robust implementation, you could validate the token with the server
            setHasAccess(true);
        } else {
            setHasAccess(false);
        }

        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-christian-accent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If no admin access, redirect to admin login
    if (!hasAccess) {
        return <Navigate to="/admin" replace />;
    }

    // If has access, render the children (admin component)
    return children;
};

export default AdminRoute;