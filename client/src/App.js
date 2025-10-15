import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import Search from './pages/Search';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import ProviderBookings from './pages/ProviderBookings';
import NearbyProviders from './pages/NearbyProviders';
import QuickBook from './pages/QuickBook';
import AboutUs from './pages/AboutUs';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* User Routes */}
        <Route
          path="/user/dashboard"
          element={token && role === 'user' ? <UserDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/user/search"
          element={token && role === 'user' ? <Search /> : <Navigate to="/" />}
        />
        <Route
          path="/user/bookings"
          element={token && role === 'user' ? <Bookings /> : <Navigate to="/" />}
        />

        {/* Provider Routes */}
        <Route
          path="/provider/dashboard"
          element={token && role === 'provider' ? <ProviderDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/provider/bookings"
          element={token && role === 'provider' ? <ProviderBookings /> : <Navigate to="/" />}
        />
        <Route path="/about" element={<AboutUs />} />

        <Route path="/user/quick-book" element={<QuickBook />} />
        <Route path="/search-nearby" element={<NearbyProviders />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
