// components/Layout.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem('role');

    const userLinks = [
        { name: '🏠 Dashboard', path: '/user/dashboard' },
        { name: '🔍 Search Providers', path: '/user/search' },
        { name: '📅 My Bookings', path: '/user/bookings' },
        { name: '⚡ Quick Book', path: '/user/quick-book' },
        { name: '👤 Profile', path: '/profile' },
        { name: 'ℹ️ About Us', path: '/about' },
    ];

    const providerLinks = [
        { name: '🏠 Dashboard', path: '/provider/dashboard' },
        { name: '📅 My Bookings', path: '/provider/bookings' },
        { name: '👤 Profile', path: '/profile' },
        { name: 'ℹ️ About Us', path: '/about' },
    ];

    const links = role === 'provider' ? providerLinks : userLinks;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="layout">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>Neighbourly</h2>
                    <p className="tagline">Your comfort. Our mission. 🤝</p>
                </div>
                <ul className="sidebar-menu">
                    {links.map(link => (
                        <li key={link.name}>
                            <Link
                                to={link.path}
                                className={location.pathname === link.path ? 'active-link' : ''}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button onClick={handleLogout} className="logout-btn">
                            🚪 Logout
                        </button>
                    </li>
                </ul>
            </div>
            <div className="main-content">{children}</div>
        </div>
    );
};

export default Layout;
