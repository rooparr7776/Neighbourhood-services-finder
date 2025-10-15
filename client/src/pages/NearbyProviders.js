import React, { useState } from 'react';
import api from '../services/api';
import Layout from './Layout';
function NearbyProviders() {
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        const res = await api.get(`providers/nearby?lat=${lat}&lng=${lng}`);
        setResults(res.data);
    };

    return (
        <Layout>
            <div className="container mt-4">
                <h4>Find Nearby Providers</h4>
                <div className="mb-3">
                    <input
                        placeholder="Latitude"
                        className="form-control mb-2"
                        value={lat}
                        onChange={e => setLat(e.target.value)}
                    />
                    <input
                        placeholder="Longitude"
                        className="form-control mb-2"
                        value={lng}
                        onChange={e => setLng(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                </div>

                <ul className="list-group">
                    {results.map((provider) => (
                        <li key={provider._id} className="list-group-item mb-3">
                            <strong>{provider.name}</strong> - {provider.category}
                            <br />
                            <img
                                src={`https://maps.googleapis.com/maps/api/staticmap?center=${provider.location.coordinates[1]},${provider.location.coordinates[0]}&zoom=14&size=300x150&markers=color:red%7C${provider.location.coordinates[1]},${provider.location.coordinates[0]}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                                alt="Map"
                                style={{ borderRadius: '8px', marginTop: '10px' }}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    );
}

export default NearbyProviders;
