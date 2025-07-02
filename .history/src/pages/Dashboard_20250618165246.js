import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardStats from '../components/DashboardStats';
import RecentProjects from '../components/RecentProjects';
import TaskOverview from '../components/TaskOverview';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeTasks: 0,
        completedTasks: 0,
        teamMembers: 0
    });
    const [recentProjects, setRecentProjects] = useState([]);
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
            setRecentProjects(projects.slice().reverse().slice(0, 5));
            setStats(prev => ({
                ...prev,
                totalProjects: projects.length,
                teamMembers: projects.reduce((acc, project) => acc + project.members.length, 0)
            }));

            const tasks = await taskService.getAllTasks();
            const activeTasks = tasks.filter(task => task.status !== 'DONE');
            const completedTasks = tasks.filter(task => task.status === 'DONE');

            setTaskStatus({
                todo: tasks.filter(task => task.status === 'TODO').length,
                inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
                done: completedTasks.length
            });

            setStats(prev => ({
                ...prev,
                activeTasks: activeTasks.length,
                completedTasks: completedTasks.length
            }));

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
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Dashboard</h1>
                </div>
            </div>
            {error && (
                <div className="error-message">{error}</div>
            )}
            <div className="dashboard-main-grid">
                <div className="stats-grid">
                    <DashboardStats stats={stats} />
                </div>
                <div className="dashboard-panel">
                    <h2>Recent Projects</h2>
                    <RecentProjects projects={recentProjects} />
                </div>
                <div className="dashboard-panel">
                    <h2>Task Overview</h2>
                    <TaskOverview taskStatus={taskStatus} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
