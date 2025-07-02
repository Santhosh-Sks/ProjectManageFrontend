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
            setRecentProjects(projects.slice(0, 5));
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
        <div className="p-6 bg-gray-100 min-h-screen">
            {error && (
                <div className="bg-red-100 text-red-800 p-4 mb-4 rounded-md shadow-md flex justify-between items-center">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <DashboardStats stats={stats} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">🧾 Recent Projects</h2>
                    <RecentProjects projects={recentProjects} />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">✅ Task Overview</h2>
                    <TaskOverview taskStatus={taskStatus} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
