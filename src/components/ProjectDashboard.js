import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaTasks, FaUsers, FaEnvelope, FaPlus } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_URL;

const ProjectDashboard = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: ''
    });
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => {
        fetchProjectData();
    }, [projectId]);

    const fetchProjectData = async () => {
        try {
            setLoading(true);
            const [projectResponse, tasksResponse, membersResponse] = await Promise.all([
                axios.get(`${API_BASE}/api/projects/${projectId}`),
                axios.get(`${API_BASE}/api/projects/${projectId}/tasks`),
                axios.get(`${API_BASE}/api/projects/${projectId}/members`)
            ]);

            setProject(projectResponse.data);
            setTasks(tasksResponse.data);
            setTeamMembers(membersResponse.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch project data');
            console.error('Error fetching project data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE}/api/projects/${projectId}/tasks`, newTask);
            setTasks([...tasks, response.data]);
            setNewTask({
                title: '',
                description: '',
                priority: 'medium',
                assignedTo: ''
            });
            setShowTaskForm(false);
        } catch (err) {
            setError('Failed to create task');
            console.error('Error creating task:', err);
        }
    };

    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/api/projects/${projectId}/invite`, { email: inviteEmail });
            setInviteEmail('');
            setShowInviteForm(false);

            const membersResponse = await axios.get(`${API_BASE}/api/projects/${projectId}/members`);
            setTeamMembers(membersResponse.data);
        } catch (err) {
            setError('Failed to send invitation');
            console.error('Error sending invitation:', err);
        }
    };

    const handleTaskStatusChange = async (taskId, newStatus) => {
        try {
            await axios.patch(`${API_BASE}/api/tasks/${taskId}`, { status: newStatus });
            setTasks(tasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            ));
        } catch (err) {
            setError('Failed to update task status');
            console.error('Error updating task status:', err);
        }
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="project-dashboard">
            <div className="project-header">
                <div className="project-info">
                    <h1>{project?.name}</h1>
                    <p className="project-description">{project?.description}</p>
                </div>
                <div className="project-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowTaskForm(true)}
                    >
                        <FaPlus /> New Task
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowInviteForm(true)}
                    >
                        <FaEnvelope /> Invite Member
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="task-stats">
                <div className="stat-card">
                    <FaTasks className="stat-icon" />
                    <h3>Total Tasks</h3>
                    <div className="stat-value">{tasks.length}</div>
                </div>
                <div className="stat-card">
                    <FaUsers className="stat-icon" />
                    <h3>Team Members</h3>
                    <div className="stat-value">{teamMembers.length}</div>
                </div>
                <div className="stat-card">
                    <FaTasks className="stat-icon" />
                    <h3>Completed Tasks</h3>
                    <div className="stat-value">
                        {tasks.filter(task => task.status === 'done').length}
                    </div>
                </div>
            </div>

            {showTaskForm && (
                <div className="task-form-container">
                    <form onSubmit={handleTaskSubmit} className="task-form">
                        <h3>Create New Task</h3>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                value={newTask.priority}
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Assign To</label>
                            <select
                                value={newTask.assignedTo}
                                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                            >
                                <option value="">Select Team Member</option>
                                {teamMembers.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowTaskForm(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-success">
                                Create Task
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {showInviteForm && (
                <div className="task-form-container">
                    <form onSubmit={handleInviteSubmit} className="task-form">
                        <h3>Invite Team Member</h3>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                required
                                placeholder="Enter email address"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowInviteForm(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-success">
                                Send Invitation
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="tasks-container">
                {['todo', 'in_progress', 'done'].map(status => (
                    <div className="tasks-column" key={status}>
                        <h3>{status === 'todo' ? 'To Do' : status === 'in_progress' ? 'In Progress' : 'Done'}</h3>
                        <div className="tasks-list">
                            {getTasksByStatus(status).map(task => (
                                <div key={task.id} className="task-card">
                                    <div className="task-header">
                                        <h4>{task.title}</h4>
                                        <span className={`priority-badge ${task.priority}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <p>{task.description}</p>
                                    <div className="task-meta">
                                        <span>
                                            <FaUsers /> {task.assignedTo}
                                        </span>
                                    </div>
                                    <div className="task-actions">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectDashboard;
