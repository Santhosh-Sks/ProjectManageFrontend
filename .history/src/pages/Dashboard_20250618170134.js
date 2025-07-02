import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import LoadingSpinner from '../components/LoadingSpinner';
import RecentProjects from '../components/RecentProjects';
import TaskOverview from '../components/TaskOverview';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recentProject, setRecentProject] = useState(null);
    const [taskStatus, setTaskStatus] = useState({
        todo: 0,
        inProgress: 0,
        done: 0
    });
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const projects = await projectService.getAllProjects();
            // Sort by createdAt if available, else reverse
            let sorted = projects;
            if (projects.length && projects[0].createdAt) {
                sorted = projects.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else {
                sorted = projects.slice().reverse();
            }
            setRecentProject(sorted[0] || null);

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

    const handleNewProject = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleProjects = () => navigate('/projects');

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Dashboard</h1>
                    <div className="header-actions">
                        <button className="btn btn-primary" onClick={handleNewProject}>New Project</button>
                        <button className="btn btn-secondary" onClick={handleProjects}>Projects</button>
                    </div>
                </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="dashboard-main-grid">
                <div className="dashboard-panel">
                    <h2>Most Recent Project</h2>
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
            {/* Modal for New Project */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={handleCloseModal}>&times;</button>
                        <h2 className="modal-title">Create New Project</h2>
                        {/* TODO: Replace with actual form */}
                        <div style={{padding: '2rem', textAlign: 'center', color: '#6366f1'}}>Project creation form goes here.</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
