// components/RatingModal.js
import React, { useState } from 'react';
import api from '../services/api';

function RatingModal({ bookingId, providerName, onClose, onSubmit }) {
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        await api.post(`bookings/${bookingId}/rate`, {
            rating,
            review,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });


        onSubmit();  // refresh parent after submit
        onClose();   // close modal
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content p-3">
                    <h5 className="mb-3">Rate {providerName}</h5>

                    <label>Rating (1-5):</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        className="form-control mb-2"
                        onChange={(e) => setRating(Number(e.target.value))}
                    />

                    <label>Review (optional):</label>
                    <textarea
                        className="form-control mb-3"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />

                    <div className="d-flex justify-content-end">
                        <button className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RatingModal;
