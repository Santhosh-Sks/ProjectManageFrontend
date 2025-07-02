import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show header on landing page
    if (location.pathname === '/') {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="app-header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <h1>Project Manager</h1>
                </Link>
                <nav className="main-nav">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <Link to="/projects" className="nav-link">Projects</Link>
                            <button onClick={handleLogout} className="nav-link logout-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/signin" className="nav-link">Sign In</Link>
                            <Link to="/signup" className="nav-link">Sign Up</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header; 