import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaProjectDiagram, FaTasks, FaUsers, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeTasks: 0,
        teamMembers: 0,
        completedTasks: 0
    });
    const [recentProjects, setRecentProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsResponse, projectsResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/dashboard/stats'),
                axios.get('http://localhost:8080/api/projects/recent')
            ]);

            setStats(statsResponse.data);
            setRecentProjects(projectsResponse.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {user?.email}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="stats-grid">
                <div className="stat-card">
                    <FaProjectDiagram className="stat-icon" />
                    <h3>Total Projects</h3>
                    <div className="stat-value">{stats.totalProjects}</div>
                </div>
                <div className="stat-card">
                    <FaTasks className="stat-icon" />
                    <h3>Active Tasks</h3>
                    <div className="stat-value">{stats.activeTasks}</div>
                </div>
                <div className="stat-card">
                    <FaUsers className="stat-icon" />
                    <h3>Team Members</h3>
                    <div className="stat-value">{stats.teamMembers}</div>
                </div>
                <div className="stat-card">
                    <FaChartLine className="stat-icon" />
                    <h3>Completed Tasks</h3>
                    <div className="stat-value">{stats.completedTasks}</div>
                </div>
            </div>

            <div className="recent-projects">
                <div className="section-header">
                    <h2>Recent Projects</h2>
                    <Link to="/projects" className="btn btn-secondary">View All Projects</Link>
                </div>
                <div className="projects-grid">
                    {recentProjects.map(project => (
                        <Link to={`/projects/${project.id}`} key={project.id} className="project-card">
                            <div className="project-header">
                                <h3>{project.name}</h3>
                                <span className="project-status">{project.status}</span>
                            </div>
                            <p className="project-description">{project.description}</p>
                            <div className="project-meta">
                                <div className="project-creator">
                                    <span className="label">Created by:</span>
                                    <span className="value">{project.createdBy}</span>
                                </div>
                                <div className="project-stats">
                                    <span className="tasks-count">
                                        <FaTasks /> {project.taskCount} Tasks
                                    </span>
                                    <span className="members-count">
                                        <FaUsers /> {project.memberCount} Members
                                    </span>
                                </div>
                            </div>
                            <div className="project-progress">
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${project.completionRate}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">{project.completionRate}% Complete</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 