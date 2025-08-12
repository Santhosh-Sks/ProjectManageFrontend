import React, { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { useParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const Project = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'TODO',
        assignedTo: '',
        projectId: id,
        comments: []
    });
    const [newMember, setNewMember] = useState('');
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const mergePreserveDefined = (original, update) => {
        const result = { ...original };
        Object.entries(update || {}).forEach(([key, value]) => {
            if (value !== undefined) {
                result[key] = value;
            }
        });
        return result;
    };

    const loadProject = useCallback(async () => {
        try {
            setLoading(true);
            const data = await projectService.getProjectById(id);
            setProject(data);
        } catch (err) {
            setError('Failed to load project');
            console.error('Project loading error:', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const loadTasks = useCallback(async () => {
        try {
            const data = await taskService.getTasksByProjectId(id);
            setTasks(prev => data.map(apiTask => {
                const existing = prev.find(t => t.id === apiTask.id);
                return existing ? mergePreserveDefined(existing, apiTask) : apiTask;
            }));
        } catch (err) {
            console.error('Tasks loading error:', err);
        }
    }, [id]);

    useEffect(() => {
        loadProject();
        loadTasks();
    }, [loadProject, loadTasks]);

    // Auto-refresh tasks every 10s
    useEffect(() => {
        const id = setInterval(() => {
            loadTasks();
        }, 10000);
        return () => clearInterval(id);
    }, [loadTasks]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const task = {
                ...newTask,
                projectId: id,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const createdTask = await taskService.createTask(task);
            
            // Add the task to the project's task list
            await projectService.addTaskToProject(id, createdTask.id);
            
            setNewTask({
                title: '',
                description: '',
                status: 'TODO',
                assignedTo: '',
                projectId: id,
                comments: []
            });
            loadTasks();
            loadProject();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            await projectService.addMemberToProject(id, newMember);
            setNewMember('');
            loadProject();
        } catch (error) {
            console.error('Error adding member:', error);
        }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        const prev = tasks;
        // Optimistic UI
        setTasks(tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));
        try {
            await taskService.updateTaskStatus(taskId, newStatus);
        } catch (error) {
            // Rollback
            setTasks(prev);
            console.error('Error updating task status:', error);
        }
    };

    const handleAddComment = async (taskId) => {
        if (!newComment.trim()) return;
        
        try {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                const updatedComments = [...(task.comments || []), newComment];
                await taskService.updateTask(taskId, {
                    ...task,
                    comments: updatedComments,
                    updatedAt: new Date()
                });
                setNewComment('');
                loadTasks();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message">{error}</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <div className="project-container">
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            
            <div className="project-details">
                <h3>Category: {project.category}</h3>
                <h3>Technologies:</h3>
                <ul>
                    {project.technologies.map((tech, index) => (
                        <li key={index}>{tech}</li>
                    ))}
                </ul>
                <p>Created by: {project.createdBy}</p>
            </div>

            <div className="members-section">
                <h3>Members</h3>
                <ul>
                    {project.members.map((member, index) => (
                        <li key={index}>{member}</li>
                    ))}
                </ul>
                <form onSubmit={handleAddMember}>
                    <input
                        type="email"
                        value={newMember}
                        onChange={(e) => setNewMember(e.target.value)}
                        placeholder="Enter member email"
                        required
                    />
                    <button type="submit">Add Member</button>
                </form>
            </div>

            <div className="tasks-section">
                <h3>Tasks</h3>
                <form onSubmit={handleCreateTask}>
                    <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        placeholder="Task title"
                        required
                    />
                    <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        placeholder="Task description"
                    />
                    <select
                        value={newTask.status}
                        onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                    >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                    <input
                        type="email"
                        value={newTask.assignedTo}
                        onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                        placeholder="Assigned to (email)"
                        required
                    />
                    <button type="submit">Create Task</button>
                </form>

                <div className="tasks-list">
                    {tasks.map((task) => (
                        <div key={task.id} className="task-card">
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                            <div className="task-status">
                                <select
                                    value={task.status}
                                    onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                                >
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Done</option>
                                </select>
                            </div>
                            
                            <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                            <p>Last updated: {new Date(task.updatedAt).toLocaleDateString()}</p>
                            
                            <div className="task-comments">
                                <h5>Comments</h5>
                                <ul>
                                    {task.comments?.map((comment, index) => (
                                        <li key={index}>{comment}</li>
                                    ))}
                                </ul>
                                <div className="add-comment">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment"
                                    />
                                    <button onClick={() => handleAddComment(task.id)}>Add Comment</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Project; 