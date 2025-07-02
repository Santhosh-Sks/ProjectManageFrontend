import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0
    });
    const [recentProjects, setRecentProjects] = useState([]);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const projects = await projectService.getAllProjects();
            const tasks = await taskService.getAllTasks();

            // Calculate statistics
            const completedTasks = tasks.filter(task => task.status === 'DONE').length;
            const pendingTasks = tasks.filter(task => task.status !== 'DONE').length;
            const activeProjects = projects.filter(project => project.status === 'ACTIVE').length;

            setStats({
                totalProjects: projects.length,
                activeProjects,
                totalTasks: tasks.length,
                completedTasks,
                pendingTasks
            });

            // Get recent projects and tasks
            setRecentProjects(projects.slice(0, 5));
            setRecentTasks(tasks.slice(0, 5));
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error('Dashboard data loading error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            
            {/* Quick Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Projects</h3>
                    <p className="stat-number">{stats.totalProjects}</p>
                    <Link to="/projects" className="stat-link">View All Projects</Link>
                </div>
                <div className="stat-card">
                    <h3>Active Projects</h3>
                    <p className="stat-number">{stats.activeProjects}</p>
                    <Link to="/projects" className="stat-link">View Active Projects</Link>
                </div>
                <div className="stat-card">
                    <h3>Total Tasks</h3>
                    <p className="stat-number">{stats.totalTasks}</p>
                    <Link to="/projects" className="stat-link">View All Tasks</Link>
                </div>
                <div className="stat-card">
                    <h3>Task Completion</h3>
                    <p className="stat-number">{stats.completedTasks}/{stats.totalTasks}</p>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill"
                            style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Recent Projects */}
            <section className="dashboard-section">
                <h2>Recent Projects</h2>
                <div className="recent-projects">
                    {recentProjects.map(project => (
                        <Link to={`/projects/${project.id}`} key={project.id} className="recent-item">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="item-meta">
                                <span className="category">{project.category}</span>
                                <span className="members-count">{project.members.length} members</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Recent Tasks */}
            <section className="dashboard-section">
                <h2>Recent Tasks</h2>
                <div className="recent-tasks">
                    {recentTasks.map(task => (
                        <div key={task.id} className="recent-item">
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <div className="item-meta">
                                <span className={`status-badge status-${task.status.toLowerCase()}`}>
                                    {task.status}
                                </span>
                                <span className="assigned-to">
                                    Assigned to: {task.assignedTo || 'Unassigned'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Actions */}
            <section className="dashboard-section">
                <h2>Quick Actions</h2>
                <div className="quick-actions">
                    <Link to="/projects/new" className="action-button">
                        Create New Project
                    </Link>
                    <Link to="/projects" className="action-button">
                        Add New Task
                    </Link>
                    <Link to="/projects" className="action-button">
                        Manage Members
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;