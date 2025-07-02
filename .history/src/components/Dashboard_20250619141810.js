import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaProjectDiagram, FaTasks, FaUsers, FaChartLine, FaCalendarAlt, FaPlus, FaSearch } from 'react-icons/fa';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import LoadingSpinner from '../components/LoadingSpinner';
import RecentProjects from '../components/RecentProjects';
import TaskOverview from '../components/TaskOverview';

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
    const [recentProject, setRecentProject] = useState(null);
    const [taskStatus, setTaskStatus] = useState({
        todo: 0,
        inProgress: 0,
        done: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const projects = await projectService.getAllProjects();
            let sorted = projects;
            if (projects.length && projects[0].createdAt) {
                sorted = projects.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else {
                sorted = projects.slice().reverse();
            }
            setRecentProject(sorted[0] || null);
            setProjects(projects);

            const tasks = await taskService.getAllTasks();
            setTaskStatus({
                todo: tasks.filter(task => task.status === 'TODO').length,
                inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
                done: tasks.filter(task => task.status === 'DONE').length
            });
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard data. Please try again.');
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

    // Debug logs to help diagnose project display issues
    console.log('User email:', user?.email);
    console.log('All projects:', projects);
    console.log('Filtered projects:', projects.filter(
      project => (project.createdBy || '').toLowerCase().trim() === (user?.email || '').toLowerCase().trim()
    ));

    if (loading) {
        return <LoadingSpinner />;
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

            <div className="dashboard-main-grid">
                <div className="dashboard-panel">
                    <h2>Recent Project</h2>
                    {recentProject ? (
                        <RecentProjects projects={[recentProject]} />
                    ) : (
                        <div>No projects found.</div>
                    )}
                </div>
                <div className="dashboard-panel">
                    <h2>Task Overview</h2>
                    <TaskOverview taskStatus={taskStatus} />
                </div>
            </div>

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
                    {projects.map((project) => (
                        <Link to={`/projects/${project._id || project.id}`} key={project.id} className="project-card">
                            <div>Title: {project.title}</div>
                            <div>CreatedBy: {project.createdBy ? project.createdBy : 'N/A'}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 