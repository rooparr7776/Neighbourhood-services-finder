import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProviderBookings() {
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:5000/api/bookings/provider', {
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

    const handleComplete = async (bookingId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:5000/api/bookings/${bookingId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Marked as completed');
            fetchBookings(); // Refresh list after update
        } catch (err) {
            console.error('Error marking as completed:', err);
            alert('Failed to mark as completed');
        }
    };

    return (
        <div className="container mt-4">
            <h3>Bookings Received</h3>
            {bookings.length === 0 ? (
                <p>No bookings yet.</p>
            ) : (
                bookings.map((b) => (
                    <div key={b._id} className="card p-3 mb-3">
                        <h5>{b.user?.name || b.userId?.name || "Unknown"} - {b.date}</h5>
                        <p>Price: ₹{b.price}</p>

                        <p><strong>Status:</strong> {b.status}</p>
                        {b.status === 'pending' && (
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleComplete(b._id)}
                            >
                                Mark as Completed
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default ProviderBookings;
