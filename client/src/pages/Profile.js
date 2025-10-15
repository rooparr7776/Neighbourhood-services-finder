// components/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import '../styles/Profile.css';
import userPlaceholder from '../assets/user.png';
import providerPlaceholder from '../assets/provider.png';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [showUploader, setShowUploader] = useState(false);
    const [uploading, setUploading] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setProfile(res.data))
            .catch(err => console.error('Failed to fetch profile:', err));
    }, []);

    const handleFileChange = (e) => {
        const f = e.target.files?.[0] || null;
        setFile(f);
        if (f) {
            const url = URL.createObjectURL(f);
            setPreview(url);
        } else {
            setPreview(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            const form = new FormData();
            form.append('photo', file);
            const up = await axios.post('http://localhost:5000/api/upload', form, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            const filename = up.data.filename;
            const patched = await axios.patch('http://localhost:5000/api/profile/photo', { filename }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(patched.data);
            setFile(null);
            setPreview(null);
            setShowUploader(false);
            alert('Profile photo updated');
        } catch (err) {
            console.error('Upload failed:', err);
            alert(err.response?.data?.message || 'Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    if (!profile) {
        return (
            <Layout>
                <div className="profile-container">Loading...</div>
            </Layout>
        );
    }

    const lat = profile.location?.coordinates ? profile.location.coordinates[1] : null;
    const lng = profile.location?.coordinates ? profile.location.coordinates[0] : null;
    const embedUrl = (lat != null && lng != null)
        ? `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`
        : null;
    const isProvider = profile.role === 'provider';
    const photoUrl = profile.photo ? `http://localhost:5000/uploads/${profile.photo}` : (isProvider ? providerPlaceholder : userPlaceholder);

    return (
        <Layout>
            <div style={{
                backgroundColor: 'black', // Bootstrap Blue
                color: 'white',
                fontSize: '3rem',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '1rem 0',
                letterSpacing: '3px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
            }}>
                <b><i>NEIGHBOURLY</i></b>
            </div>

            <div className="profile-container fade-in">
                <h3 className="profile-heading">👤 Your Profile</h3>
                <div className="profile-card">
                    <div className="profile-avatar-wrap">
                        <img src={preview || photoUrl} alt="Profile" className="profile-img" />
                        <button className="edit-image-btn" onClick={() => setShowUploader(!showUploader)}>
                            {showUploader ? 'Cancel' : (profile.photo ? 'Edit image' : 'Add image')}
                        </button>
                    </div>
                    {embedUrl && (
                        <div className="map-embed" style={{ width: '400px', height: '200px' }}>
                            <iframe
                                title="Location Map"
                                src={embedUrl}
                                width="400"
                                height="200"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                            />
                        </div>
                    )}
                    <div className="profile-details">
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
                        {profile.category && <p><strong>Category:</strong> {profile.category}</p>}
                        {profile.avg_rating && <p><strong>Rating:</strong> {profile.avg_rating.toFixed(2)}</p>}
                        
                        {showUploader && (
                            <div className="uploader">
                                <input id="photoInput" type="file" accept="image/*" onChange={handleFileChange} />
                                <button
                                    disabled={!file || uploading}
                                    onClick={handleUpload}
                                    className="upload-button"
                                >
                                    {uploading ? 'Uploading...' : 'Save photo'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Profile;
