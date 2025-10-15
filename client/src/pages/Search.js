// pages/Search.js
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import '../styles/Search.css';

function Search() {
    const categories = useMemo(() => ['Babysitter','Carpenter','Cleaner','Electrician','Gardener','Maid','Painter','Pest Control','Plumber','Tutor','Watchman'], []);
    const [category, setCategory] = useState(''); // the chosen category from dropdown
    const [query, setQuery] = useState(''); // input text
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlight, setHighlight] = useState(0);
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [results, setResults] = useState([]);
    const [notes, setNotes] = useState({}); // providerId -> note
    const [requested, setRequested] = useState({}); // providerId -> true

    const getPosition = () => new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos),
            (err) => reject(err),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5000/api/profile', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        .then(res => {
            const coords = res.data?.location?.coordinates;
            if (coords && coords.length >= 2) {
                setLng(String(coords[0]));
                setLat(String(coords[1]));
            }
        })
        .catch(() => {});
    }, []);

    const suggestions = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return categories.filter(c => c.toLowerCase().includes(q));
    }, [categories, query]);

    const selectCategory = (value) => {
        setCategory(value);
        setQuery(value);
        setShowSuggestions(false);
    };

    const handleSearch = async () => {
        if (!category || !categories.includes(category)) {
            alert('Please choose a category from the dropdown.');
            return;
        }
        const params = new URLSearchParams();
        if (lat) params.append('lat', lat);
        if (lng) params.append('lng', lng);
        if (category) params.append('category', category);
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/providers/nearby?${params.toString()}` , {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setResults(res.data);
    };

    const handleBook = async (providerId) => {
        const token = localStorage.getItem('token');
        try {
            const note = notes[providerId] || '';
            await axios.post('http://localhost:5000/api/bookings', { providerId, note }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequested(prev => ({ ...prev, [providerId]: true }));
        } catch (e) {
            alert(e.response?.data?.message || 'Failed to send request');
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
            <div className="search-container">
                <h2 className="search-heading"><b>Search Service Providers</b></h2>
                <h4><b>Type a service category: </b></h4>
                <p>Babysitter,Carpenter,Cleaner,Electrician,Gardener,Maid,Painter,Pest Control,Plumber,Tutor,Watchman</p>
                <div className="autocomplete">
                    <input
                        className="search-input"
                        placeholder="Category (choose from suggestions)"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setCategory('');
                            setShowSuggestions(true);
                            setHighlight(0);
                        }}
                        onFocus={() => query && setShowSuggestions(true)}
                        onKeyDown={(e) => {
                            if (!showSuggestions || suggestions.length === 0) return;
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setHighlight((h) => (h + 1) % suggestions.length);
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
                            } else if (e.key === 'Enter') {
                                e.preventDefault();
                                selectCategory(suggestions[highlight]);
                            } else if (e.key === 'Escape') {
                                setShowSuggestions(false);
                            }
                        }}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="autocomplete-list">
                            {suggestions.map((s, idx) => (
                                <li
                                    key={s}
                                    className={idx === highlight ? 'active' : ''}
                                    onMouseEnter={() => setHighlight(idx)}
                                    onMouseDown={(e) => { e.preventDefault(); selectCategory(s); }}
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* Removed 'Use my location' button: defaults to user's registered location */}
                {/* Coordinates are loaded from profile automatically; inputs removed as requested */}
                <button onClick={handleSearch} className="search-button">Search</button>

                {results.map((provider) => (
                    <div key={provider._id} className="provider-card">
                        <h3 className="provider-name">
                            {provider.name}
                            {provider.badge === 'gold' && (
                                <span className="badge-gold">🥇 Gold</span>
                            )}
                            {provider.badge === 'silver' && (
                                <span className="badge-silver">🥈 Silver</span>
                            )}
                        </h3>
                        <textarea
                            className="request-textarea"
                            placeholder="Add details for your request (optional)"
                            value={notes[provider._id] || ''}
                            onChange={(e) => setNotes(prev => ({ ...prev, [provider._id]: e.target.value }))}
                        />
                        <button
                            onClick={() => handleBook(provider._id)}
                            className="book-button"
                            disabled={!!requested[provider._id]}
                        >
                            {requested[provider._id] ? 'Request Sent' : 'Book'}
                        </button>
                    </div>
                ))}
            </div>
        </Layout>
    );
}

export default Search;

