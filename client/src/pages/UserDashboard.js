import React from 'react';
import Layout from './Layout';
import '../styles/DashboardUnified.css';
import image from '../assets/welcomeImage.jpg';

function UserDashboard() {
    return (
        <Layout>
            <div className="dash-hero">
                <b><i>NEIGHBOURLY</i></b>
            </div>

            <div className="dash-container">
                <h2 className="dash-sub">Welcome back, Neighbour! 🏡</h2>

                {/* Centered Image */}
                <div className="dash-image-wrapper">
                    <img 
                        src={image} 
                        alt="Neighborhood Services" 
                        className="dash-image"
                    />
                </div>

                {/* Grid of Cards */}
                <div className="dash-grid">
                    <div className="dash-card">
                        <div className="dash-card-content">
                            <h3>Tip of the day</h3>
                            <p>Weekday bookings are usually faster and cheaper.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default UserDashboard;
