import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getAllProjects();
            setProjects(data);
        } catch (err) {
            setError('Failed to load projects');
            console.error('Error loading projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const getProjectStats = () => {
        const totalProjects = projects.length;
        const totalTasks = projects.reduce((acc, project) => acc + (project.tasks?.length || 0), 0);
        const completedTasks = projects.reduce((acc, project) => 
            acc + (project.tasks?.filter(task => task.status === 'COMPLETED')?.length || 0), 0);
        
        return {
            totalProjects,
            totalTasks,
            completedTasks,
            completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
        };
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message">{error}</div>;

    const stats = getProjectStats();

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {user?.email}</h1>
                <Link to="/projects" className="btn btn-primary">View All Projects</Link>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Projects</h3>
                    <p className="stat-value">{stats.totalProjects}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Tasks</h3>
                    <p className="stat-value">{stats.totalTasks}</p>
                </div>
                <div className="stat-card">
                    <h3>Completed Tasks</h3>
                    <p className="stat-value">{stats.completedTasks}</p>
                </div>
                <div className="stat-card">
                    <h3>Completion Rate</h3>
                    <p className="stat-value">{stats.completionRate}%</p>
                </div>
            </div>

            <div className="recent-projects">
                <h2>Recent Projects</h2>
                <div className="projects-grid">
                    {projects.slice(0, 4).map((project) => (
                        <Link to={`/projects/${project.id}`} key={project.id} className="project-card">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="project-meta">
                                <span className="category">{project.category}</span>
                                <div className="project-stats">
                                    <span className="tasks-count">{project.tasks?.length || 0} Tasks</span>
                                    <span className="members-count">{project.members?.length || 0} Members</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;