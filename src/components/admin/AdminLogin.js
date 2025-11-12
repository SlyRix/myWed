// src/components/admin/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS, buildApiUrl, API_CONFIG } from '../../config/api';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsChecking(true);
        setError('');

        try {
            // Call backend authentication endpoint
            const response = await fetch(buildApiUrl(ENDPOINTS.adminLogin), {
                method: 'POST',
                headers: API_CONFIG.headers,
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store authentication token in localStorage
                localStorage.setItem('adminToken', data.token);
                // Redirect to admin dashboard
                navigate('/admin/dashboard');
            } else {
                setError(data.error || 'Invalid admin password');
                setPassword('');
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Login error:', err);
            }
            setError('Failed to connect to server. Please try again.');
            setPassword('');
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-2xl font-bold">Admin Access</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        This area is restricted to site administrators
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="password" className="sr-only">Admin Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-christian-accent"
                            placeholder="Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div role="alert" aria-live="polite" className="text-red-500 text-sm">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isChecking}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-christian-accent hover:bg-christian-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-christian-accent"
                        >
                            {isChecking ? 'Checking...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;