import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { io } from 'socket.io-client';

const REACTIONS = {
    '👍': 'thumbsup',
    '❤️': 'heart',
    '🎉': 'celebration',
    '👀': 'eyes',
    '💡': 'idea'
};

const CommentList = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [showReactions, setShowReactions] = useState(null);
    const [mentionSearch, setMentionSearch] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
    const [teamMembers, setTeamMembers] = useState([]);
    const socketRef = useRef();
    const { user } = useAuth();

    useEffect(() => {
        fetchComments();
        fetchTeamMembers();
        setupWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [taskId]);

    const setupWebSocket = () => {
        socketRef.current = io('http://localhost:8080');
        
        socketRef.current.on('newComment', (comment) => {
            if (comment.taskId === taskId) {
                setComments(prev => [...prev, comment]);
            }
        });

        socketRef.current.on('commentUpdated', (updatedComment) => {
            setComments(prev => prev.map(comment => 
                comment.id === updatedComment.id ? updatedComment : comment
            ));
        });

        socketRef.current.on('commentDeleted', (commentId) => {
            setComments(prev => prev.filter(comment => comment.id !== commentId));
        });

        socketRef.current.on('reactionAdded', ({ commentId, reaction, user }) => {
            setComments(prev => prev.map(comment => {
                if (comment.id === commentId) {
                    const reactions = { ...comment.reactions };
                    if (!reactions[reaction]) {
                        reactions[reaction] = [];
                    }
                    if (!reactions[reaction].includes(user)) {
                        reactions[reaction].push(user);
                    }
                    return { ...comment, reactions };
                }
                return comment;
            }));
        });
    };

    const fetchTeamMembers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/projects/${taskId}/members`);
            setTeamMembers(response.data);
        } catch (err) {
            console.error('Error fetching team members:', err);
        }
    };

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
                createdBy: user.email,
                reactions: {}
            };

            const response = await axios.post('http://localhost:8080/api/comments', comment);
            socketRef.current.emit('newComment', response.data);
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

            socketRef.current.emit('commentUpdated', response.data);
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
            socketRef.current.emit('commentDeleted', commentId);
            setComments(comments.filter(comment => comment.id !== commentId));
            setError(null);
        } catch (err) {
            setError('Failed to delete comment');
            console.error('Error deleting comment:', err);
        }
    };

    const handleReaction = async (commentId, reaction) => {
        try {
            await axios.post(`http://localhost:8080/api/comments/${commentId}/reactions`, {
                reaction,
                user: user.email
            });
            socketRef.current.emit('reactionAdded', { commentId, reaction, user: user.email });
        } catch (err) {
            console.error('Error adding reaction:', err);
        }
    };

    const handleMention = (member) => {
        const mention = `@${member.email} `;
        setNewComment(prev => prev + mention);
        setShowMentions(false);
    };

    const handleCommentChange = (e) => {
        const value = e.target.value;
        setNewComment(value);

        // Check for @ symbol to show mentions
        const lastAtIndex = value.lastIndexOf('@');
        if (lastAtIndex !== -1) {
            const searchText = value.slice(lastAtIndex + 1);
            setMentionSearch(searchText);
            setShowMentions(true);
            
            // Position the mentions dropdown
            const textarea = e.target;
            const position = textarea.getBoundingClientRect();
            setMentionPosition({
                top: position.bottom + window.scrollY,
                left: position.left + lastAtIndex * 8
            });
        } else {
            setShowMentions(false);
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
                    onChange={handleCommentChange}
                    placeholder="Add a comment... Use @ to mention team members"
                    className="comment-input"
                    rows="3"
                />
                {showMentions && (
                    <div 
                        className="mentions-dropdown"
                        style={{
                            top: mentionPosition.top,
                            left: mentionPosition.left
                        }}
                    >
                        {teamMembers
                            .filter(member => 
                                member.email.toLowerCase().includes(mentionSearch.toLowerCase())
                            )
                            .map(member => (
                                <div
                                    key={member.email}
                                    className="mention-item"
                                    onClick={() => handleMention(member)}
                                >
                                    {member.email}
                                </div>
                            ))
                        }
                    </div>
                )}
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
                                
                                <div className="comment-reactions">
                                    <button
                                        className="btn btn-link"
                                        onClick={() => setShowReactions(showReactions === comment.id ? null : comment.id)}
                                    >
                                        Add Reaction
                                    </button>
                                    {showReactions === comment.id && (
                                        <div className="reactions-picker">
                                            {Object.entries(REACTIONS).map(([emoji, name]) => (
                                                <button
                                                    key={emoji}
                                                    className="reaction-btn"
                                                    onClick={() => handleReaction(comment.id, emoji)}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {comment.reactions && Object.entries(comment.reactions).map(([emoji, users]) => (
                                        users.length > 0 && (
                                            <div key={emoji} className="reaction-badge">
                                                <span className="reaction-emoji">{emoji}</span>
                                                <span className="reaction-count">{users.length}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentList; 