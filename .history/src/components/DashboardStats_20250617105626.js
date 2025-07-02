import React from 'react';

const DashboardStats = ({ stats }) => {
    return (
        <div className="stats-grid">
            <div className="stat-card">
                <h3>Total Projects</h3>
                <p className="stat-value">{stats.totalProjects}</p>
            </div>
            <div className="stat-card">
                <h3>Active Tasks</h3>
                <p className="stat-value">{stats.activeTasks}</p>
            </div>
            <div className="stat-card">
                <h3>Completed Tasks</h3>
                <p className="stat-value">{stats.completedTasks}</p>
            </div>
            <div className="stat-card">
                <h3>Team Members</h3>
                <p className="stat-value">{stats.teamMembers}</p>
            </div>
        </div>
    );
};

export default DashboardStats; 