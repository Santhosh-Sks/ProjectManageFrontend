import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <h1 className="landing-title">Welcome to ProjectStack</h1>
                
                <div className="landing-buttons">
                    <Link to="/signup" className="btn btn-primary">
                        Get Started
                    </Link>
                    <Link to="/signin" className="btn btn-secondary">
                        Sign In
                    </Link>
                </div>

                
            </div>
        </div>
    );
};

export default Landing;
