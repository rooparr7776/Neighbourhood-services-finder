import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css';
import MapPicker from '../components/MapPicker';
import LocationSelector from '../components/LocationSelector';

function Login() {
    const categories = ['Babysitter','Carpenter','Cleaner','Electrician','Gardener','Maid','Painter','Pest Control','Plumber','Tutor','Watchman'];
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [category, setCategory] = useState('');
    const [photo, setPhoto] = useState(null);
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoError, setGeoError] = useState('');
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [locationConfirmed, setLocationConfirmed] = useState(false);
    

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('auth/login', {
                email,
                password,
                role,
            });

            // Save JWT and role to localStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);

            // Redirect to appropriate dashboard and refresh to re-evaluate token/role
            if (res.data.role === 'user') {
                navigate('/user/dashboard');
                window.location.reload(); // 🔁 Force re-evaluation of token & role
            } else {
                navigate('/provider/dashboard');
                window.location.reload(); // 🔁
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    const getPosition = () =>
        new Promise((resolve, reject) => {
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
        if (isRegister) {
            setGeoLoading(true);
            setGeoError('');
            getPosition()
                .then((pos) => {
                    setLat(String(pos.coords.latitude));
                    setLng(String(pos.coords.longitude));
                })
                .catch((e) => {
                    setGeoError('Unable to get current location');
                })
                .finally(() => setGeoLoading(false));
        }
    }, [isRegister]);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!locationConfirmed) {
    alert('Please pick your location from the map or use current location before registering.');
    return;
}

        try {
            if (!lat || !lng) {
                setGeoLoading(true);
                setGeoError('');
                try {
                   const pos = await getPosition();
const nlat = pos.coords.latitude.toFixed(6);
const nlng = pos.coords.longitude.toFixed(6);
setLat(nlat);
setLng(nlng);
setLocationConfirmed(true); // ✅ mark location as confirmed


                } catch (ge) {
                    setGeoError('Unable to get current location');
                    alert('Location permission is required for registration');
                    setGeoLoading(false);
                    return;
                }
                setGeoLoading(false);
            }
            // Validate category for provider
            if (role === 'provider' && !categories.includes(category)) {
                alert('Please choose a valid category from the dropdown');
                return;
            }

            // Basic phone validation
            if (!phone || phone.trim().length < 7) {
                alert('Please enter a valid phone number');
                return;
            }

            const form = new FormData();
            form.append('role', role);
            form.append('name', name);
            form.append('email', email);
            form.append('password', password);
            form.append('phone', phone);
            form.append('lat', String(lat));
            form.append('lng', String(lng));
            if (role === 'provider') {
                form.append('category', category);
                if (photo) form.append('photo', photo);
            }

            const res = await api.post('auth/register', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);

            if (res.data.role === 'user') {
                navigate('/user/dashboard');
                window.location.reload();
            } else {
                navigate('/provider/dashboard');
                window.location.reload();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    return (

        <div className="login-container">
            <div className="login-form-wrapper">
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
                    <b><i> ~NEIGHBOURLY~ </i></b>
                </div>                <p className="subheading"><i>Neighbourhood Services Finder</i></p>
                <div className="toggle-auth">
                    <button type="button" className={`toggle-button ${!isRegister ? 'active' : ''}`} onClick={() => setIsRegister(false)}>Login</button>
                    <button type="button" className={`toggle-button ${isRegister ? 'active' : ''}`} onClick={() => setIsRegister(true)}>Register</button>
                </div>
                {!isRegister ? (
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label className="label">Email:</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="label">Password:</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="label">Role:</label>
                        <select
                            className="input-field"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="user">User</option>
                            <option value="provider">Provider</option>
                        </select>
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                ) : (
                <form onSubmit={handleRegister} className="login-form">
                    <div className="input-group">
                        <label className="label">Name:</label>
                        <input
                            type="text"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="label">Phone:</label>
                        <input
                            type="tel"
                            className="input-field"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="label">Email:</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="label">Password:</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="label">Role:</label>
                        <select
                            className="input-field"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="user">User</option>
                            <option value="provider">Provider</option>
                        </select>
                    </div>
                    {role === 'provider' && (
                        <>
                            <div className="input-group">
                                <label className="label">Category:</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    list="categories"
                                    placeholder="Start typing to select..."
                                    required
                                />
                                <datalist id="categories">
                                    {categories.map((c) => (
                                        <option key={c} value={c} />
                                    ))}
                                </datalist>
                            </div>
                            <div className="input-group">
                                <label className="label">Photo:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="input-field"
                                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                                />
                            </div>
                        </>
                    )}
                    <div className="input-group">
  <label className="label">Location:</label>
  <div className="input-field" style={{ display: 'flex', flexDirection: 'column' }}>
    <span>
      {geoLoading
        ? 'Taking location info from current location...'
        : lat && lng
        ? `Selected Location: ${lat}, ${lng}`
        : geoError || 'No location selected'}
    </span>
    <button
      type="button"
      className="login-button"
      onClick={async () => {
        if (!lat || !lng) {
          setGeoLoading(true);
          setGeoError('');
          try {
            const pos = await getPosition();
            setLat(String(pos.coords.latitude));
            setLng(String(pos.coords.longitude));
          } catch {
            setGeoError('Unable to get current location');
          } finally {
            setGeoLoading(false);
          }
        }
        if (!locationConfirmed) {
    alert('Please select your location before registering.');
    return;
}

      }}
    >
      Use current location
    </button>
  </div>
  <div style={{ marginTop: '10px' }}>
   <LocationSelector
  initialLat={lat}
  initialLng={lng}
  onChange={({ lat: nlat, lng: nlng, confirmed }) => {
    setLat(nlat);
    setLng(nlng);
    if (confirmed) setLocationConfirmed(true); // mark as confirmed only if user clicked on map
  }}
/>


  </div>
</div>

                    <button type="submit" className="login-button">Register</button>
                </form>
                )}
            </div>
        </div>
    );
}

export default Login;

