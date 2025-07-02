import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaProjectDiagram, FaTasks, FaUsers, FaChartLine, FaCalendarAlt, FaPlus, FaSearch } from 'react-icons/fa';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeTasks: 0,
        teamMembers: 0,
        completedTasks: 0
    });
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsResponse, projectsResponse] = await Promise.all([
                axios.get('http://localhost:8080/api/dashboard/stats'),
                axios.get('http://localhost:8080/api/projects')
            ]);

            setStats(statsResponse.data);
            setProjects(projectsResponse.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch dashboard data');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleProjectClick = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <div className="header-content">
                    <h1>Welcome back, {user?.email}</h1>
                    <div className="header-actions">
                        <Link to="/projects/create" className="btn btn-primary">
                            <FaPlus /> New Project
                        </Link>
                    </div>
                </div>
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
                    <h2>Your Projects</h2>
                    <div className="header-actions">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                </div>
                <div className="projects-grid">
                    {filteredProjects
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 5)
                        .map(project => (
                            <div 
                                key={project.id} 
                                className="project-card"
                                onClick={() => handleProjectClick(project.id)}
                            >
                                <div className="project-header">
                                    <h3>{project.name}</h3>
                                    <span className={`project-status ${project.status.toLowerCase()}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <p className="project-description">{project.description}</p>
                                <div className="project-meta">
                                    <div className="project-creator">
                                        <span className="label">Created by:</span>
                                        <span className="value">{project.createdBy}</span>
                                    </div>
                                    <div className="project-date">
                                        <FaCalendarAlt />
                                        <span>{formatDate(project.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="project-stats">
                                    <span className="tasks-count">
                                        <FaTasks /> {project.taskCount || 0} Tasks
                                    </span>
                                    <span className="members-count">
                                        <FaUsers /> {project.memberCount || 0} Members
                                    </span>
                                </div>
                                <div className="project-progress">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${project.completionRate || 0}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{project.completionRate || 0}% Complete</span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 