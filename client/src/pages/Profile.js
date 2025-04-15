import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setProfile(res.data);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) return <div>Loading...</div>;

    const mapUrl = profile.location?.coordinates
        ? `https://maps.googleapis.com/maps/api/staticmap?center=${profile.location.coordinates[1]},${profile.location.coordinates[0]}&zoom=14&size=300x150&markers=color:red%7C${profile.location.coordinates[1]},${profile.location.coordinates[0]}&key=${process.env.REACT_APP_MAPS_API_KEY}`
        : null;
    console.log("Coordinates:", profile.location.coordinates);

    return (
        <div className="container mt-4">
            <h3>Your Profile</h3>
            <img
                src={`http://localhost:5000/uploads/${profile.photo}`}
                alt="Profile"
                style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                }}
            />

            {mapUrl && (
                <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${profile.location.coordinates[1]},${profile.location.coordinates[0]}&zoom=14&size=400x200&markers=color:red%7C${profile.location.coordinates[1]},${profile.location.coordinates[0]}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                    alt="Map"
                />

            )}


            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            {profile.category && <p><strong>Category:</strong> {profile.category}</p>}
            {profile.price && <p><strong>Price:</strong> ₹{profile.price}</p>}
            {profile.avg_rating && <p><strong>Average Rating:</strong> {profile.avg_rating}</p>}
            {profile.availableDates?.length > 0 && (
                <p><strong>Available Dates:</strong> {profile.availableDates.join(', ')}</p>
            )}
        </div>
    );
}

export default Profile;
