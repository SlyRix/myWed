import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { ENDPOINTS, buildApiUrl } from '../../config/api';

/**
 * Protected route component for admin-only pages
 * Validates admin authentication token with backend before granting access
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactElement} Protected content or redirect
 */
const AdminRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        /**
         * Validates admin token with backend server
         * SECURITY: Never trust localStorage alone - always validate server-side
         */
        const validateToken = async () => {
            const token = localStorage.getItem('adminToken');

            if (!token) {
                setHasAccess(false);
                setLoading(false);
                return;
            }

            try {
                // Validate token with backend by attempting to fetch guest list
                const response = await fetch(buildApiUrl(ENDPOINTS.guests), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    // Token is valid
                    setHasAccess(true);
                } else {
                    // Token invalid or expired - clear it
                    localStorage.removeItem('adminToken');
                    setHasAccess(false);
                }
            } catch (error) {
                // Network error or server down - deny access and clear token
                if (process.env.NODE_ENV === 'development') {
                    console.error('Token validation failed:', error);
                }
                localStorage.removeItem('adminToken');
                setHasAccess(false);
            } finally {
                setLoading(false);
            }
        };

        validateToken();
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

AdminRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default AdminRoute;