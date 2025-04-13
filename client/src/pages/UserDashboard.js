import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/'); // back to login
    };

    return (
        <div className="container mt-5">
            <h2>Welcome to User Dashboard</h2>
            {/* Add your user features here */}

            <button onClick={handleLogout} className="btn btn-danger mt-3">
                Logout
            </button>
        </div>
    );
}

export default UserDashboard;
