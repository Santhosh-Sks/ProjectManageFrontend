import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus, FaUsers, FaCalendarAlt, FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

const ProjectDashboard = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium'
    });

    useEffect(() => {
        fetchProjectData();
    }, [projectId]);

    const fetchProjectData = async () => {
        try {
            setLoading(true);
            const [projectResponse, tasksResponse, membersResponse] = await Promise.all([
                axios.get(`http://localhost:8080/api/projects/${projectId}`),
                axios.get(`http://localhost:8080/api/projects/${projectId}/tasks`),
                axios.get(`http://localhost:8080/api/projects/${projectId}/members`)
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
            const response = await axios.post(`http://localhost:8080/api/projects/${projectId}/tasks`, {
                ...newTask,
                createdBy: user.email
            });
            setTasks([...tasks, response.data]);
            setShowTaskForm(false);
            setNewTask({
                title: '',
                description: '',
                assignedTo: '',
                dueDate: '',
                priority: 'medium'
            });
        } catch (err) {
            setError('Failed to create task');
            console.error('Error creating task:', err);
        }
    };

    const handleTaskStatusChange = async (taskId, newStatus) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/tasks/${taskId}`, {
                status: newStatus
            });
            setTasks(tasks.map(task => 
                task.id === taskId ? response.data : task
            ));
        } catch (err) {
            setError('Failed to update task status');
            console.error('Error updating task status:', err);
        }
    };

    const getTaskCountByStatus = (status) => {
        return tasks.filter(task => task.status === status).length;
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
                        <FaPlus /> Add Task
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="task-stats">
                <div className="stat-card">
                    <FaSpinner className="stat-icon" />
                    <h3>To Do</h3>
                    <div className="stat-value">{getTaskCountByStatus('todo')}</div>
                </div>
                <div className="stat-card">
                    <FaSpinner className="stat-icon" />
                    <h3>In Progress</h3>
                    <div className="stat-value">{getTaskCountByStatus('in_progress')}</div>
                </div>
                <div className="stat-card">
                    <FaCheckCircle className="stat-icon" />
                    <h3>Completed</h3>
                    <div className="stat-value">{getTaskCountByStatus('done')}</div>
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
                                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Assign To</label>
                            <select
                                value={newTask.assignedTo}
                                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                                required
                            >
                                <option value="">Select Team Member</option>
                                {teamMembers.map(member => (
                                    <option key={member.email} value={member.email}>
                                        {member.email}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                value={newTask.priority}
                                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">Create Task</button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setShowTaskForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="tasks-container">
                <div className="tasks-column">
                    <h3>To Do</h3>
                    <div className="tasks-list">
                        {tasks
                            .filter(task => task.status === 'todo')
                            .map(task => (
                                <div key={task.id} className="task-card">
                                    <div className="task-header">
                                        <h4>{task.title}</h4>
                                        <span className={`priority-badge ${task.priority}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <p>{task.description}</p>
                                    <div className="task-meta">
                                        <span className="assigned-to">
                                            <FaUsers /> {task.assignedTo}
                                        </span>
                                        <span className="due-date">
                                            <FaCalendarAlt /> {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="task-actions">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleTaskStatusChange(task.id, 'in_progress')}
                                        >
                                            Start Task
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="tasks-column">
                    <h3>In Progress</h3>
                    <div className="tasks-list">
                        {tasks
                            .filter(task => task.status === 'in_progress')
                            .map(task => (
                                <div key={task.id} className="task-card">
                                    <div className="task-header">
                                        <h4>{task.title}</h4>
                                        <span className={`priority-badge ${task.priority}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <p>{task.description}</p>
                                    <div className="task-meta">
                                        <span className="assigned-to">
                                            <FaUsers /> {task.assignedTo}
                                        </span>
                                        <span className="due-date">
                                            <FaCalendarAlt /> {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="task-actions">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleTaskStatusChange(task.id, 'done')}
                                        >
                                            Complete
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="tasks-column">
                    <h3>Completed</h3>
                    <div className="tasks-list">
                        {tasks
                            .filter(task => task.status === 'done')
                            .map(task => (
                                <div key={task.id} className="task-card completed">
                                    <div className="task-header">
                                        <h4>{task.title}</h4>
                                        <span className={`priority-badge ${task.priority}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                    <p>{task.description}</p>
                                    <div className="task-meta">
                                        <span className="assigned-to">
                                            <FaUsers /> {task.assignedTo}
                                        </span>
                                        <span className="due-date">
                                            <FaCalendarAlt /> {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="task-actions">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleTaskStatusChange(task.id, 'in_progress')}
                                        >
                                            Reopen
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDashboard; 