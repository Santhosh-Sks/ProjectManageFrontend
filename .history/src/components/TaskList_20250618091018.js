import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = ({ projectId }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'TODO',
        assignedTo: ''
    });

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/tasks?projectId=${projectId}`);
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
            const response = await axios.post('http://localhost:8080/api/tasks', {
                ...newTask,
                projectId
            });
            setTasks([...tasks, response.data]);
            setNewTask({
                title: '',
                description: '',
                status: 'TODO',
                assignedTo: ''
            });
        } catch (err) {
            setError('Failed to create task');
            console.error('Error creating task:', err);
        }
    };

    const handleUpdateTask = async (taskId, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/tasks/${taskId}`, updatedData);
            setTasks(tasks.map(task => task.id === taskId ? response.data : task));
        } catch (err) {
            setError('Failed to update task');
            console.error('Error updating task:', err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:8080/api/tasks/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (err) {
            setError('Failed to delete task');
            console.error('Error deleting task:', err);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="task-list-container">
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleCreateTask} className="task-form">
                <h3>Create New Task</h3>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        required
                    />
                </div>
                <div className="form-group">
                    <textarea
                        placeholder="Task Description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <select
                        value={newTask.status}
                        onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                    >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>
                <button type="submit" className="btn">Create Task</button>
            </form>

            <div className="tasks-grid">
                {tasks.map(task => (
                    <div key={task.id} className="task-card">
                        <div className="task-header">
                            <h3>{task.title}</h3>
                            <span className={`status-badge status-${task.status.toLowerCase()}`}>
                                {task.status}
                            </span>
                        </div>
                        <p>{task.description}</p>
                        <div className="task-meta">
                            <span>Assigned to: {task.assignedTo}</span>
                            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="task-actions">
                            <button 
                                onClick={() => handleUpdateTask(task.id, {...task, status: 'DONE'})}
                                className="btn btn-secondary"
                            >
                                Mark Complete
                            </button>
                            <button 
                                onClick={() => handleDeleteTask(task.id)}
                                className="btn btn-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList; 