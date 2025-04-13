import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Bookings() {
    const [upcoming, setUpcoming] = useState([]);
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState('all');

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

            // Re-fetch both upcoming and history after cancellation
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
        <div className="container mt-4">
            <h3>Upcoming Bookings</h3>
            {upcoming.length === 0 ? (
                <p>No upcoming bookings.</p>
            ) : (
                upcoming.map((booking) => (
                    <div key={booking._id} className="card p-2 mb-2">
                        <p><strong>{booking.provider?.name || 'N/A'}</strong> on {booking.date}</p>
                        <p>Status: {booking.status}</p>
                        <p>Price: ₹{booking.provider?.price ?? 'N/A'}</p>


                        {booking.status === 'pending' && (
                            <button onClick={() => cancelBooking(booking._id)} className="btn btn-danger btn-sm">
                                Cancel
                            </button>
                        )}
                    </div>
                ))
            )}

            <hr className="my-4" />

            <h4>Booking History</h4>
            <select
                className="form-select mb-3"
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
                    <div key={booking._id} className="card p-2 mb-2">
                        <p><strong>{booking.provider?.name || 'N/A'}</strong> on {booking.date}</p>
                        <p>Status: {booking.status}</p>
                        <p>Price: ₹{booking.price}</p>

                    </div>
                ))
            )}
        </div>
    );
}

export default Bookings;
