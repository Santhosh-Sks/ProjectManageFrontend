import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
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
                            <Link to="/" className="nav-link">Projects</Link>
                            <div className="user-menu">
                                <span className="user-email">{user.email}</span>
                                <button onClick={handleLogout} className="logout-button">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/SignIn" className="nav-link">Login</Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header; 