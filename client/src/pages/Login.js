import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
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


            // ✅ Force re-render for App.js to pick up new token/role
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h3>Login</h3>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Role:</label>
                    <select
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="user">User</option>
                        <option value="provider">Provider</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>
    );
}

export default Login;
