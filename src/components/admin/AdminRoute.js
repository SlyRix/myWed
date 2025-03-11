// src/components/admin/AdminRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        // Check if user has admin access
        const adminAccess = localStorage.getItem('adminAccess') === 'true';
        setHasAccess(adminAccess);
        setLoading(false);
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // If no admin access, redirect to admin login
    if (!hasAccess) {
        return <Navigate to="/admin" replace />;
    }

    // If has access, render the children (admin component)
    return children;
};

export default AdminRoute;