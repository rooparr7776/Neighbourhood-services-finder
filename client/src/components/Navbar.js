import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
            <span className="navbar-brand">Services Finder</span>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    {role === "user" && (
                        <>
                            <li className="nav-item"><Link className="nav-link" to="/search">Search</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/bookings">Bookings</Link></li>
                        </>
                    )}
                    {role === "provider" && (
                        <>
                            <li className="nav-item"><Link className="nav-link" to="/bookings">My Bookings</Link></li>
                        </>
                    )}
                    <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
                </ul>
                <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
