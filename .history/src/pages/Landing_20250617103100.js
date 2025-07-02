import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <h1>Welcome to Project Manager</h1>
                <p>Manage your projects efficiently with our powerful project management tool.</p>
                <div className="landing-buttons">
                    <Link to="/signin" className="btn btn-primary">Sign In</Link>
                    <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
                </div>
                <div className="landing-features">
                    <div className="feature">
                        <h3>Project Management</h3>
                        <p>Create and manage projects with ease</p>
                    </div>
                    <div className="feature">
                        <h3>Task Tracking</h3>
                        <p>Track tasks and their progress</p>
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
