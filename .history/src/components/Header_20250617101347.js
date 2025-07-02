import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="app-header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <h1>Project Manager</h1>
                </Link>
                <nav className="main-nav">
                    <Link to="/" className="nav-link">Projects</Link>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header; 