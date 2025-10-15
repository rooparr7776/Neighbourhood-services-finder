// components/QuickBook.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from './Layout';
import '../styles/QuickBook.css';

function QuickBook() {
    const [providers, setProviders] = useState([]);
    const [message, setMessage] = useState('');
    const [notes, setNotes] = useState({}); // providerId -> note
    const [requested, setRequested] = useState({}); // providerId -> true

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const res = await api.get('providers/quick-book/top-providers');
                setProviders(res.data);
            } catch (err) {
                console.error('Failed to fetch top providers:', err);
            }
        };

        fetchProviders();
    }, []);

    const handleBookNow = async (providerId) => {
        try {
            await api.post('bookings', {
                providerId,
                note: notes[providerId] || '',
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setRequested(prev => ({ ...prev, [providerId]: true }));
            setMessage(`✅ Request sent`);
        } catch (err) {
            console.error('Booking failed:', err);
            setMessage(err.response?.data?.message || '❌ Booking failed');
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

            <div className="quickbook-container">
                <div className="quickbook-banner">
                    <h2><b><strong>Quick Book</strong></b></h2>
                    <p>Book with a single click!<br></br>Find top-rated help near you and book instantly!</p>
                </div>

                {message && <div className="quickbook-alert">{message}</div>}

                <div className="quickbook-grid">
                    {providers.map((provider) => (
                        <div className="quickbook-card" key={provider._id}>
                            <img
                                src={`https://neighbourly-m2st.onrender.com/uploads/${provider.photo}`}
                                alt={provider.name}
                                className="quickbook-img"
                            />
                            <h3 className="quickbook-name">
                                {provider.name}
                                {provider.badge === 'gold' && <span className="badge-gold">🥇</span>}
                                {provider.badge === 'silver' && <span className="badge-silver">🥈</span>}
                            </h3>
                            <div className="quickbook-info">
                                <p>🛠️ {provider.category}</p>
                                <p>⭐ {provider.avg_rating}</p>
                                <textarea
                                    className="quickbook-textarea"
                                    placeholder="Add details for your request (optional)"
                                    value={notes[provider._id] || ''}
                                    onChange={(e) => setNotes(prev => ({ ...prev, [provider._id]: e.target.value }))}
                                />
                                <button className="quickbook-btn" onClick={() => handleBookNow(provider._id)} disabled={!!requested[provider._id]}>
                                    {requested[provider._id] ? 'Request Sent' : 'Book Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default QuickBook;
