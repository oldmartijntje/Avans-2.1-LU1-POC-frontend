import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">Welcome!</h2>
                    <p className="text-blue-700">
                        This is a protected page that only authenticated users can access.
                    </p>
                </div>

                {user && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Information</h3>
                            <div className="space-y-2">
                                <p><span className="font-medium">Username:</span> {user.username}</p>
                                <p><span className="font-medium">Email:</span> {user.email}</p>
                                <p><span className="font-medium">Role:</span> {user.role}</p>
                                <p><span className="font-medium">User Uuid:</span> {user.uuid}</p>
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-green-900 mb-2">Access Level</h3>
                            <p className="text-green-700">
                                As a <strong>{user.role}</strong>, you have access to this protected dashboard.
                            </p>
                            <div className="mt-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ✓ Authenticated
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
