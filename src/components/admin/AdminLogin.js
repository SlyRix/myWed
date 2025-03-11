// src/components/admin/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsChecking(true);
        setError('');

        // Simple admin authentication
        setTimeout(() => {
            if (password === '123') { // Change this to your desired admin password
                // Set admin access in localStorage
                localStorage.setItem('adminAccess', 'true');
                // Redirect to admin dashboard
                navigate('/admin/dashboard');
            } else {
                setError('Invalid admin password');
                setPassword('');
            }
            setIsChecking(false);
        }, 800);
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
                        <div className="text-red-500 text-sm">{error}</div>
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