// pages/Bookings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RatingModal from '../components/RatingModal';
import ChatModal from '../components/ChatModal';
import Layout from './Layout';
import '../styles/Bookings.css';

function Bookings() {
    const [upcoming, setUpcoming] = useState([]);
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showRating, setShowRating] = useState(null);
    const [chatBookingId, setChatBookingId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchUpcoming = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/bookings/upcoming', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUpcoming(res.data);
            } catch (err) {
                console.error('Error fetching upcoming bookings:', err);
            }
        };

        const fetchHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/bookings?filter=${filter}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHistory(res.data);
            } catch (err) {
                console.error('Error fetching booking history:', err);
            }
        };

        fetchUpcoming();
        fetchHistory();
    }, [filter]);

    const cancelBooking = async (bookingId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Booking cancelled");

            const updatedUpcoming = await axios.get('http://localhost:5000/api/bookings/upcoming', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUpcoming(updatedUpcoming.data);

            const updatedHistory = await axios.get(`http://localhost:5000/api/bookings?filter=${filter}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistory(updatedHistory.data);

        } catch (err) {
            console.error(err);
            alert("Failed to cancel booking");
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
            <div className="bookings-container">
                <h3 className="section-heading"><b>Upcoming Bookings</b></h3>
                {upcoming.length === 0 ? (
                    <p>No upcoming bookings.</p>
                ) : (
                    upcoming.map((booking) => (
                        <div key={booking._id} className="booking-card">
                            <p><strong>{booking.provider?.name || 'N/A'}</strong></p>
                            <p>
                                {booking.status === 'pending' && <><strong>Confirmation Pending</strong></>}
                                {booking.status === 'accepted' && <><strong>Booking Confirmed</strong></>}
                                {(booking.status !== 'pending' && booking.status !== 'accepted') && <>Status: {booking.status}</>}
                            </p>
                            {(booking.status === 'pending' || booking.status === 'accepted') && (
                                <div className="booking-actions">
                                    <button onClick={() => setChatBookingId(booking._id)} className="chat-button">Chat</button>
                                    <button onClick={() => cancelBooking(booking._id)} className="cancel-button">Cancel</button>
                                </div>
                            )}
                        </div>
                    ))
                )}

                <hr className="divider" />

                <h4 className="section-heading">Booking History</h4>
                <select
                    className="filter-dropdown"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                {history.length === 0 ? (
                    <p>No bookings found.</p>
                ) : (
                    history.map((booking) => (
                        <div key={booking._id} className="booking-card">
                            <p><strong>{booking.provider?.name || 'N/A'}</strong></p>
                            <p>
                                {booking.status === 'pending' && <><strong>Confirmation Pending</strong></>}
                                {booking.status === 'accepted' && <><strong>Booking Confirmed</strong></>}
                                {(booking.status !== 'pending' && booking.status !== 'accepted') && <>Status: {booking.status}</>}
                            </p>
                            {booking.rating && (
                                <p>⭐ You rated this: {booking.rating}/5</p>
                            )}
                            {booking.review && (
                                <p>💬 "{booking.review}"</p>
                            )}

                            {booking.status === 'completed' && !booking.rating && (
                                <button className="rate-button" onClick={() => setShowRating(booking)}>
                                    Rate
                                </button>
                            )}
                            {(booking.status === 'pending' || booking.status === 'accepted') && (
                                <div className="booking-actions">
                                    <button onClick={() => setChatBookingId(booking._id)} className="chat-button">Chat</button>
                                    <button onClick={() => cancelBooking(booking._id)} className="cancel-button">Cancel</button>
                                </div>
                            )}
                            {showRating && (
                                <RatingModal
                                    bookingId={showRating._id}
                                    providerName={showRating.provider?.name || 'Provider'}
                                    onClose={() => setShowRating(null)}
                                    onSubmit={() => {
                                        setShowRating(null);
                                        const token = localStorage.getItem('token');
                                        axios.get(`http://localhost:5000/api/bookings?filter=${filter}`, {
                                            headers: { Authorization: `Bearer ${token}` },
                                        }).then(res => setHistory(res.data));
                                    }}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>
            {chatBookingId && (
                <ChatModal bookingId={chatBookingId} onClose={() => setChatBookingId(null)} />
            )}
        </Layout>
    );
}

export default Bookings;
