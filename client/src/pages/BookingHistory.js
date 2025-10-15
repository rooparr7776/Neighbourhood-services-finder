// pages/BookingHistory.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import RatingModal from '../components/RatingModal';
import Layout from './Layout';

function BookingHistory() {
    const [history, setHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchHistory = async () => {
        const token = localStorage.getItem('token');
        const res = await api.get('bookings/history', {
            headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleRateClick = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    return (
        <Layout>
            <div className="container mt-4">
                <h3>Booking History</h3>
                {history.map((b) => (
                    <div key={b._id} className="card p-2 mb-2">
                        <p>{b.provider.name} - {b.date} - {b.status}</p>
                        <p>Price: ₹{booking.price}</p>

                        {b.status === 'completed' && !b.rated && (
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleRateClick(b)}
                            >
                                Rate
                            </button>
                        )}
                    </div>
                ))}

                {showModal && selectedBooking && (
                    <RatingModal
                        bookingId={selectedBooking._id}
                        providerName={selectedBooking.provider.name}
                        onClose={() => setShowModal(false)}
                        onSubmit={() => {
                            setShowModal(false);
                            fetchHistory(); // refresh history to update rated status
                        }}
                    />
                )}
            </div>
        </Layout>
    );
}

export default BookingHistory;
