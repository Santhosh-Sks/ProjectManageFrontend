import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import LoadingSpinner from '../components/LoadingSpinner';
import RecentProjects from '../components/RecentProjects';
import TaskOverview from '../components/TaskOverview';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recentProject, setRecentProject] = useState(null);
    const [taskStatus, setTaskStatus] = useState({
        todo: 0,
        inProgress: 0,
        done: 0
    });
    const navigate = useNavigate();
    const { user } = useAuth();

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

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="dashboard-container">
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
            <div className="projects-grid">
                {projects.map(project => (
                    <div key={project.id} className="project-card">
                        <div>Title: {project.title}</div>
                        <div>CreatedBy: {project.createdBy ? project.createdBy : 'N/A'}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
