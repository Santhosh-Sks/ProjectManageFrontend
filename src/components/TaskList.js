import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Assuming you have toast for notifications

const API_BASE = process.env.REACT_APP_API_URL; // Use a placeholder or your actual API URL

const TaskList = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('createdAt');
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'TODO',
        assignedTo: ''
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // Fetch tasks from the API when the component mounts or projectId changes
    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/api/tasks?projectId=${projectId}`);
            setTasks(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE}/api/tasks`, {
                ...newTask,
                projectId,
                createdAt: new Date().toISOString()
            });
            setTasks([...tasks, response.data]);
            setNewTask({
                title: '',
                description: '',
                status: 'TODO',
                assignedTo: ''
            });
            toast.success('Task created successfully!');
        } catch (err) {
            setError('Failed to create task');
            console.error('Error creating task:', err);
        }
    };

    const handleUpdateTask = async (taskId, updatedData) => {
        try {
            const response = await axios.put(`${API_BASE}/api/tasks/${taskId}`, updatedData);
            setTasks(tasks.map(task => task.id === taskId ? response.data : task));
            toast.success('Task updated successfully!');
        } catch (err) {
            setError('Failed to update task');
            console.error('Error updating task:', err);
        }
    };

    const handleDeleteTask = (taskId) => {
        setTaskToDelete(taskId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;
        try {
            await axios.delete(`${API_BASE}/api/tasks/${taskToDelete}`);
            setTasks(tasks.filter(task => task.id !== taskToDelete));
            toast.success('Task deleted successfully!');
        } catch (err) {
            setError('Failed to delete task');
            console.error('Error deleting task:', err);
        } finally {
            setShowDeleteConfirm(false);
            setTaskToDelete(null);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                // FIX: Correctly merge the updated status with the existing task object
                await handleUpdateTask(taskId, { ...task, status: newStatus });
            }
        } catch (err) {
            setError('Failed to update task status');
            console.error('Error updating task status:', err);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'ALL') return true;
        return task.status === filter;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'status':
                return a.status.localeCompare(b.status);
            case 'createdAt':
                return new Date(b.createdAt) - new Date(a.createdAt);
            default:
                return 0;
        }
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="task-list-container p-6 bg-gray-50 rounded-lg shadow-inner">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">All Tasks</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="createdAt">Sort by Date</option>
                        <option value="title">Sort by Title</option>
                        <option value="status">Sort by Status</option>
                    </select>
                </div>
            </div>

            <form onSubmit={handleCreateTask} className="task-form p-4 mb-6 bg-gray-200 rounded-lg shadow-sm flex flex-col gap-4">
                <h3 className="text-xl font-semibold">Create New Task</h3>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="p-2 border rounded-lg"
                    required
                />
                <textarea
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="p-2 border rounded-lg"
                />
                <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                    className="p-2 border rounded-lg"
                >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">Create Task</button>
            </form>

            <div className="tasks-grid grid gap-4">
                {sortedTasks.map(task => (
                    <div key={task.id} className="task-card p-4 bg-white rounded-lg shadow-md">
                        <div className="task-header flex justify-between items-center mb-2">
                            <h3 className="font-bold text-lg">{task.title}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                task.status === 'DONE' ? 'bg-green-200 text-green-800' :
                                task.status === 'IN_PROGRESS' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'
                            }`}>
                                {task.status}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-2">{task.description}</p>
                        <div className="task-meta text-sm text-gray-500 mb-4">
                            <span>Assigned to: {task.assignedTo || 'N/A'}</span>
                            <br/>
                            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="task-actions flex justify-between items-center">
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                className="p-1 border rounded-lg"
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showDeleteConfirm && (
                <ConfirmationDialog
                    message="Are you sure you want to delete this task?"
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}
        </div>
    );
};

export default TaskList;
