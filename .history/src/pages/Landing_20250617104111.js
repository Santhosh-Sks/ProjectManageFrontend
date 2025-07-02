import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <h1>Project Management Made Simple</h1>
                <p className="landing-subtitle">
                    Organize your projects, track tasks, and collaborate with your team - all in one place.
                </p>
                <div className="landing-features">
                    <div className="feature">
                        <h3>Task Management</h3>
                        <p>Create, assign, and track tasks with ease</p>
                    </div>
                    <div className="feature">
                        <h3>Team Collaboration</h3>
                        <p>Work together seamlessly with your team members</p>
                    </div>
                    <div className="feature">
                        <h3>Progress Tracking</h3>
                        <p>Monitor project progress with real-time updates</p>
                    </div>
                </div>
                <div className="landing-cta">
                    <Link to="/signup" className="btn btn-primary">Get Started</Link>
                    <Link to="/signin" className="btn btn-secondary">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;
