import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationDialog from '../components/ConfirmationDialog';

const Project = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        status: 'TODO'
    });
    const [newMember, setNewMember] = useState('');
    const [newComment, setNewComment] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({
        isOpen: false,
        taskId: null
    });
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteMsg, setInviteMsg] = useState("");

    const loadProject = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await projectService.getProjectById(id);
            setProject(data);
        } catch (err) {
            console.error('Error loading project:', err);
            setError('Failed to load project details. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    const loadTasks = useCallback(async () => {
        try {
            setError(null);
            const data = await taskService.getTasksByProjectId(id);
            setTasks(data || []);
        } catch (err) {
            console.error('Error loading tasks:', err);
            setError('Failed to load tasks. Please try again.');
            setTasks([]);
        }
    }, [id]);

    useEffect(() => {
        loadProject();
        loadTasks();
    }, [loadProject, loadTasks]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await taskService.createTask({
                ...newTask,
                projectId: id
            });
            setNewTask({
                title: '',
                description: '',
                assignedTo: '',
                status: 'TODO'
            });
            loadTasks();
        } catch (err) {
            setError('Failed to create task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await projectService.addMemberToProject(id, newMember);
            setNewMember('');
            loadProject();
        } catch (err) {
            setError('Failed to add member. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            setLoading(true);
            await taskService.updateTask(taskId, { status: newStatus });
            loadTasks();
        } catch (err) {
            setError('Failed to update task status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            setLoading(true);
            await taskService.deleteTask(taskId);
            loadTasks();
        } catch (err) {
            setError('Failed to delete task. Please try again.');
        } finally {
            setLoading(false);
            setDeleteDialog({ isOpen: false, taskId: null });
        }
    };

    const handleAddComment = async (taskId) => {
        if (!newComment.trim()) return;
        try {
            setLoading(true);
            await taskService.addComment(taskId, newComment);
            setNewComment('');
            loadTasks();
        } catch (err) {
            setError('Failed to add comment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !project) {
        return <LoadingSpinner />;
    }

    if (!project) {
        return <div className="error-message">Project not found</div>;
    }

    return (
        <div className="project-details">
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            <div className="project-header">
                <h1>{project.title || 'Untitled Project'}</h1>
                <p>{project.description || 'No description available'}</p>
                <div className="project-meta">
                    <span className="category">{project.category || 'General'}</span>
                    <div className="technology-tags">
                        {project.technologies && project.technologies.length > 0 ? (
                            project.technologies.map((tech, index) => (
                                <span key={index} className="tech-tag">{tech}</span>
                            ))
                        ) : (
                            <span className="tech-tag">No technologies specified</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="project-sections">
                <div className="members-section">
                    <h2>Team Members</h2>
                    <form onSubmit={handleAddMember} className="add-member-form">
                        <input
                            type="email"
                            value={newMember}
                            onChange={(e) => setNewMember(e.target.value)}
                            placeholder="Enter member's email"
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Member'}
                        </button>
                    </form>
                    <div className="members-list">
                        {project.members && project.members.length > 0 ? (
                            project.members.map((member, index) => (
                                <div key={index} className="member-item">
                                    {member}
                                </div>
                            ))
                        ) : (
                            <div className="member-item">No members yet</div>
                        )}
                    </div>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setInviteMsg("");
                            try {
                                const res = await fetch('http://localhost:8080/api/emails/invitation', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ 
                                        toEmail: inviteEmail, 
                                        projectId: id
                                    }),
                                });
                                const data = await res.json();
                                setInviteMsg(data.message || 'Invitation sent!');
                                setInviteEmail("");
                            } catch {
                                setInviteMsg('Failed to send invitation.');
                            }
                        }}
                        className="invite-form"
                    >
                        <div className="invite-input-group">
                            <input
                                type="email"
                                placeholder="Invite user by email"
                                value={inviteEmail}
                                onChange={e => setInviteEmail(e.target.value)}
                                required
                                className="invite-input"
                            />
                            <button type="submit" className="invite-button">Send Invitation</button>
                        </div>
                        {inviteMsg && <div className="invite-message">{inviteMsg}</div>}
                    </form>
                </div>

                <div className="tasks-section">
                    <h2>Tasks</h2>
                    <form onSubmit={handleCreateTask} className="create-task-form">
                        <div className="form-group">
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Task title"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                value={newTask.description}
                                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Task description"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="email"
                                value={newTask.assignedTo}
                                onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                                placeholder="Assign to (email)"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Task'}
                        </button>
                    </form>

                    <div className="tasks-list">
                        {tasks && tasks.length > 0 ? (
                            tasks.map(task => (
                                <div key={task.id} className="task-card">
                                    <div className="task-header">
                                        <h3>{task.title || 'Untitled Task'}</h3>
                                        <select
                                            value={task.status || 'TODO'}
                                            onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="TODO">To Do</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="DONE">Done</option>
                                        </select>
                                    </div>
                                    <p>{task.description || 'No description'}</p>
                                    <div className="task-meta">
                                        <span>Assigned to: {task.assignedTo || 'Unassigned'}</span>
                                        <span>Created: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown'}</span>
                                    </div>
                                    <div className="task-comments">
                                        <h4>Comments</h4>
                                        {console.log('Task data:', task)}
                                        <ul>
                                            {task.comment ? (
                                                <li>
                                                    <p>{task.comment}</p>
                                                    <small>{task.commentAddedAt ? new Date(task.commentAddedAt).toLocaleString() : 'Unknown'}</small>
                                                </li>
                                            ) : task.comments && task.comments.length > 0 ? (
                                                task.comments.map((comment, index) => (
                                                    <li key={index}>
                                                        <p>{comment.text || comment}</p>
                                                        <small>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Unknown'}</small>
                                                    </li>
                                                ))
                                            ) : (
                                                <li>No comments yet</li>
                                            )}
                                        </ul>
                                        <div className="add-comment">
                                            <input
                                                type="text"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a comment"
                                            />
                                            <button
                                                onClick={() => handleAddComment(task.id)}
                                                disabled={loading || !newComment.trim()}
                                            >
                                                Add Comment
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        className="delete-button"
                                        onClick={() => setDeleteDialog({ isOpen: true, taskId: task.id })}
                                    >
                                        Delete Task
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="no-tasks">
                                <p>No tasks yet. Create your first task above!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, taskId: null })}
                onConfirm={() => handleDeleteTask(deleteDialog.taskId)}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
            />
        </div>
    );
};

export default Project; 