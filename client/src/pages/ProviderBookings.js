import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from './Layout';
import '../styles/ProviderBookings.css';
import ChatModal from '../components/ChatModal';

function ProviderBookings() {
    const [bookings, setBookings] = useState([]);
    const [chatBookingId, setChatBookingId] = useState(null);
    const [showLocationFor, setShowLocationFor] = useState(null);

    const getUserLatLng = (b) => {
        const coords = b.user?.location?.coordinates || b.userId?.location?.coordinates;
        if (!coords || coords.length < 2) return null;
        return { lat: coords[1], lng: coords[0] };
    };

    const getEmbedUrl = (b) => {
        const pos = getUserLatLng(b);
        if (!pos) return null;
        return `https://www.google.com/maps?q=${pos.lat},${pos.lng}&z=14&output=embed`;
    };

    const fetchBookings = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await api.get('bookings/provider', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(res.data);
        } catch (err) {
            console.error('Error fetching provider bookings:', err);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const acceptBooking = async (bookingId) => {
        const token = localStorage.getItem('token');
        try {
            await api.post(`bookings/${bookingId}/accept`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchBookings();
        } catch (err) {
            console.error('Error accepting booking:', err);
            alert('Failed to accept booking');
        }
    };

    const rejectBooking = async (bookingId) => {
        const token = localStorage.getItem('token');
        try {
            await api.post(`bookings/${bookingId}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchBookings();
        } catch (err) {
            console.error('Error rejecting booking:', err);
            alert('Failed to reject booking');
        }
    };

    const handleComplete = async (bookingId) => {
        const token = localStorage.getItem('token');
        try {
            await api.post(`bookings/${bookingId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Marked as completed');
            fetchBookings(); // Refresh list after update
        } catch (err) {
            console.error('Error marking as completed:', err);
            alert('Failed to mark as completed');
        }
    };

    const cancelBooking = async (bookingId) => {
        const token = localStorage.getItem('token');
        try {
            await api.post(`bookings/${bookingId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchBookings();
        } catch (err) {
            console.error('Error cancelling booking:', err);
        }
    };

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
            <div className="provider-bookings-container">
                <h2 className="bookings-title">📋 Bookings You’ve Received</h2>

                {bookings.length === 0 ? (
                    <div className="empty-booking-msg">
                        <p>Looks like it’s a chill day 🧘‍♀️<br />No bookings yet.</p>
                    </div>
                ) : (
                    bookings.map((b) => (
                        <div key={b._id} className="booking-card">
                            <h3>{b.title || (b.user?.name || b.userId?.name || "Unknown")}</h3>
                            <p><strong>Status:</strong> {b.status}</p>
                            {b.note && <p><strong>Request details:</strong> {b.note}</p>}

                            {b.rating && <p>⭐ <strong>User rated:</strong> {b.rating}/5</p>}
                            {b.review && <p>💬 "{b.review}"</p>}

                            {(b.status === 'pending' || b.status === 'accepted') && (
                                <div className="booking-actions">
                                    <button className="chat-button" onClick={() => setChatBookingId(b._id)}>Chat</button>
                                    <button
                                        className="login-button"
                                        style={{marginLeft: 8}}
                                        onClick={() => setShowLocationFor(prev => prev === b._id ? null : b._id)}
                                    >
                                        {showLocationFor === b._id ? 'Hide location' : 'Show location'}
                                    </button>
                                    {b.status === 'pending' && (
                                        <>
                                            <button className="accept-btn" onClick={() => acceptBooking(b._id)}>Accept</button>
                                            <button className="reject-btn" onClick={() => rejectBooking(b._id)}>Reject</button>
                                        </>
                                    )}
                                    {b.status === 'accepted' && (
                                        <>
                                            <button className="cancel-button" onClick={() => cancelBooking(b._id)}>Cancel</button>
                                            <button className="complete-btn" onClick={() => handleComplete(b._id)}>
                                                ✅ Mark as Completed
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                            {(b.status === 'pending' || b.status === 'accepted') && showLocationFor === b._id && getEmbedUrl(b) && (
                                <div style={{ marginTop: '10px' }}>
                                    <iframe
                                        title={`user-location-${b._id}`}
                                        src={getEmbedUrl(b)}
                                        width="100%"
                                        height="200"
                                        style={{ border: 0, borderRadius: '8px' }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
                {chatBookingId && (
                    <ChatModal bookingId={chatBookingId} onClose={() => setChatBookingId(null)} />
                )}
            </div>
        </Layout>
    );
}

export default ProviderBookings;
