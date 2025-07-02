import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

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
    };

    return (
        <header className="app-header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <div className="logo-container">
                        <img 
                            src="/project-icon.png" 
                            alt="ProjectStack Logo" 
                            className="logo-icon"
                        />
                        <h1 className="logo-text">ProjectStack</h1>
                    </div>
                </Link>
                <nav className="main-nav">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            
                            <button onClick={handleLogout} className="nav-link logout-button">
                                Logout
                            </button>
                            <button 
                                onClick={toggleTheme} 
                                className="theme-toggle"
                                aria-label="Toggle dark mode"
                            >
                                {isDarkMode ? '🌞' : '🌙'}
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