import React, { useState, useEffect } from 'react';
import MapPicker from './MapPicker';

function LocationSelector({ initialLat, initialLng, onChange }) {
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);

  // Whenever user picks a location on map, update local state and propagate to parent
  const handleChange = ({ lat: nlat, lng: nlng }) => {
  setLat(nlat);
  setLng(nlng);
  onChange && onChange({ lat: nlat, lng: nlng, confirmed: true });
};


  return (
    <div>
      <button
        className="login-button"
        onClick={() => setShowMapPicker((prev) => !prev)}
        style={{ marginBottom: '10px' }}
      >
        {showMapPicker ? 'Hide Map' : 'Pick Location'}
      </button>

      {showMapPicker && (
        <div style={{ height: 300 }}>
          <MapPicker
            lat={lat ? Number(lat) : undefined}
            lng={lng ? Number(lng) : undefined}
            height={300}
            visible={showMapPicker}
            onChange={handleChange}
          />
        </div>
      )}

      {lat && lng && (
        <p>
          Selected Location: {lat}, {lng}
        </p>
      )}
    </div>
  );
}

export default LocationSelector;
