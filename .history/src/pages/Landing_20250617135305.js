import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <h1 className="landing-title">Welcome to ProjectStack</h1>
                <p className="landing-subtitle">Manage your projects efficiently</p>
                
                <div className="landing-buttons">
                    <Link to="/signup" className="btn btn-primary">
                        Get Started
                    </Link>
                    <Link to="/signin" className="btn btn-secondary">
                        Sign In
                    </Link>
                </div>

                <div className="landing-features">
                    <div className="feature">
                        <h3>Project Management</h3>
                        <p>Create and manage your projects with ease</p>
                    </div>
                    <div className="feature">
                        <h3>Task Tracking</h3>
                        <p>Keep track of all your tasks and deadlines</p>
                    </div>
                    <div className="feature">
                        <h3>Team Collaboration</h3>
                        <p>Work together with your team members</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
