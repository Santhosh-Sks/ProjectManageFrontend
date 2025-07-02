import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Don't show header on landing page
    if (location.pathname === '/') {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode');
    };

    return (
        <header className="app-header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <div className="logo-container">
                        <img 
                            src="/project-icon.png" 
                            alt="ProjectStack Logo" 
                            className="logo-icon animate-spin-slow"
                        />
                        <h1 className="logo-text">ProjectStack</h1>
                    </div>
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
                        <button 
                            onClick={toggleTheme} 
                            className="theme-toggle"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? '🌞' : '🌙'}
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header; 