import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CommentList = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/comments/task/${taskId}`);
            setComments(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch comments');
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const comment = {
                content: newComment,
                taskId: taskId,
                createdBy: user.email
            };

            const response = await axios.post('http://localhost:8080/api/comments', comment);
            setComments([...comments, response.data]);
            setNewComment('');
            setError(null);
        } catch (err) {
            setError('Failed to add comment');
            console.error('Error adding comment:', err);
        }
    };

    const handleEdit = async (commentId, content) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/comments/${commentId}`, {
                content,
                taskId,
                createdBy: user.email
            });

            setComments(comments.map(comment => 
                comment.id === commentId ? response.data : comment
            ));
            setEditingComment(null);
            setError(null);
        } catch (err) {
            setError('Failed to update comment');
            console.error('Error updating comment:', err);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await axios.delete(`http://localhost:8080/api/comments/${commentId}`);
            setComments(comments.filter(comment => comment.id !== commentId));
            setError(null);
        } catch (err) {
            setError('Failed to delete comment');
            console.error('Error deleting comment:', err);
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
        <div className="comment-section">
            <h3>Comments</h3>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="comment-input"
                    rows="3"
                />
                <button type="submit" className="btn">Add Comment</button>
            </form>

            <div className="comments-list">
                {comments.map(comment => (
                    <div key={comment.id} className="comment-card">
                        {editingComment === comment.id ? (
                            <div className="edit-comment">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="comment-input"
                                    rows="3"
                                />
                                <div className="edit-actions">
                                    <button 
                                        onClick={() => handleEdit(comment.id, newComment)}
                                        className="btn btn-secondary"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setEditingComment(null);
                                            setNewComment('');
                                        }}
                                        className="btn btn-link"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="comment-header">
                                    <div className="comment-meta">
                                        <span className="comment-author">{comment.createdBy}</span>
                                        <span className="comment-date">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    {user.email === comment.createdBy && (
                                        <div className="comment-actions">
                                            <button
                                                onClick={() => {
                                                    setEditingComment(comment.id);
                                                    setNewComment(comment.content);
                                                }}
                                                className="btn btn-link"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="btn btn-link text-danger"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="comment-content">{comment.content}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentList; 