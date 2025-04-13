import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProviderDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <h2>Welcome to Provider Dashboard</h2>
            {/* Add provider-related actions here */}

            <button onClick={handleLogout} className="btn btn-danger mt-3">
                Logout
            </button>
        </div>
    );
}

export default ProviderDashboard;
