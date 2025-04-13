// pages/Search.js
import React, { useState } from 'react';
import axios from 'axios';

function Search() {
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:5000/api/bookings/search', {
            category,
            date,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data);
    };

    const handleBook = async (providerId) => {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/bookings', {
            providerId,
            date,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        alert('Booking confirmed!');
    };

    return (
        <div className="container mt-5">
            <h3>Search Providers</h3>
            <input className="form-control mb-2" placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
            <input type="date" className="form-control mb-2" onChange={(e) => setDate(e.target.value)} />
            <button onClick={handleSearch} className="btn btn-primary mb-3">Search</button>

            {results.map((provider) => (
                <div key={provider._id} className="card mb-2 p-2">
                    <h5>{provider.name} ({provider.category})</h5>
                    <button onClick={() => handleBook(provider._id)} className="btn btn-success btn-sm">Book</button>
                </div>
            ))}
        </div>
    );
}

export default Search;
