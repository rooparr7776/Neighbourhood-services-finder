import React, { useEffect, useRef } from 'react';
import '../styles/MapPicker.css';

function ensureLeafletLoaded() {
  return new Promise((resolve) => {
    if (window.L) return resolve();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.crossOrigin = '';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.crossOrigin = '';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

function MapPicker({ lat, lng, onChange, height = 320, zoom = 13, visible = true }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const lastClickedRef = useRef(null); // to avoid snapping back

  useEffect(() => {
    let cancelled = false;
    ensureLeafletLoaded().then(() => {
      if (cancelled || !mapRef.current) return;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = window.L.map(mapRef.current).setView(
          [lat ?? 12.9716, lng ?? 77.5946],
          zoom
        );

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapInstanceRef.current);

        if (lat && lng) {
          markerRef.current = window.L.marker([Number(lat), Number(lng)]).addTo(mapInstanceRef.current);
          lastClickedRef.current = { lat: Number(lat), lng: Number(lng) };
        }

        mapInstanceRef.current.on('click', (e) => {
          const { lat: clat, lng: clng } = e.latlng;
          if (markerRef.current) {
            markerRef.current.setLatLng([clat, clng]);
          } else {
            markerRef.current = window.L.marker([clat, clng]).addTo(mapInstanceRef.current);
          }
          lastClickedRef.current = { lat: clat, lng: clng };
          onChange && onChange({ lat: clat.toFixed(6), lng: clng.toFixed(6) });
        });

        setTimeout(() => {
          try { mapInstanceRef.current.invalidateSize(); } catch {}
        }, 100);
      }

      // Only update marker if parent provides new coords AND user hasn't clicked yet
      if (lat != null && lng != null && (!lastClickedRef.current || (lastClickedRef.current.lat !== Number(lat) || lastClickedRef.current.lng !== Number(lng)))) {
        if (!markerRef.current) {
          markerRef.current = window.L.marker([Number(lat), Number(lng)]).addTo(mapInstanceRef.current);
        } else {
          markerRef.current.setLatLng([Number(lat), Number(lng)]);
        }
        mapInstanceRef.current.setView([Number(lat), Number(lng)], mapInstanceRef.current.getZoom());
      }
    });

    return () => { cancelled = true; };
  }, [lat, lng, zoom, visible, onChange]);

  useEffect(() => {
    if (mapInstanceRef.current && visible) {
      setTimeout(() => {
        try { mapInstanceRef.current.invalidateSize(); } catch {}
      }, 100);
    }
  }, [visible]);

  return (
    <div className="map-picker" style={{ height }}>
      <div ref={mapRef} className="map-picker-canvas" />
      <div className="map-picker-hint">Click on the map to choose a location</div>
    </div>
  );
}

export default MapPicker;
