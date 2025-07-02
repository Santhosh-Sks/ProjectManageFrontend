import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';
import LoadingSpinner from '../components/LoadingSpinner';

const ProjectInvitation = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        loadProject();
    }, [projectId]);

    const loadProject = async () => {
        try {
            setLoading(true);
            const data = await projectService.getProjectById(projectId);
            setProject(data);
        } catch (err) {
            console.error('Error loading project:', err);
            setError('Project not found or invitation is invalid.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinProject = async () => {
        if (!user) {
            // Redirect to signin with return URL
            navigate(`/signin?redirect=/project-invitation/${projectId}`);
            return;
        }

        try {
            setIsJoining(true);
            console.log('Joining project:', projectId, 'with user:', user.email);
            console.log('User object:', user);
            
            // Add current user to project members
            const result = await projectService.addMemberToProject(projectId, user.email);
            console.log('Join project result:', result);
            
            // Show success message
            alert('Successfully joined the project!');
            
            // Redirect to project dashboard
            navigate(`/projects/${projectId}`);
        } catch (err) {
            console.error('Error joining project:', err);
            console.error('Error details:', {
                projectId,
                userEmail: user.email,
                error: err.message,
                response: err.response?.data
            });
            setError(`Failed to join project: ${err.message || 'Unknown error'}`);
        } finally {
            setIsJoining(false);
        }
    };

    // Handle direct access from email links (backend URLs)
    useEffect(() => {
        // Check if this is a direct access from email (no user context)
        if (location.pathname.includes('/api/projects/')) {
            // Extract projectId from the path
            const pathParts = location.pathname.split('/');
            const extractedProjectId = pathParts[pathParts.length - 1];
            if (extractedProjectId && extractedProjectId !== projectId) {
                // Redirect to the correct frontend URL
                navigate(`/project-invitation/${extractedProjectId}`);
                return;
            }
        }

        // Handle SSL errors by checking if we're on https and redirecting to http
        if (window.location.protocol === 'https:' && window.location.hostname === 'localhost') {
            const httpUrl = window.location.href.replace('https:', 'http:');
            window.location.href = httpUrl;
            return;
        }
    }, [location.pathname, projectId, navigate]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error || !project) {
        return (
            <div className="invitation-container">
                <div className="invitation-card error">
                    <h2>Invalid Invitation</h2>
                    <p>{error || 'This project invitation is no longer valid.'}</p>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="invitation-container">
            <div className="invitation-card">
                <div className="invitation-header">
                    <h1>Project Invitation</h1>
                    <p>You've been invited to join a project!</p>
                </div>

                <div className="project-info">
                    <h2>{project.title || 'Untitled Project'}</h2>
                    <p>{project.description || 'No description available'}</p>
                    <div className="project-meta">
                        <span className="category">{project.category || 'General'}</span>
                        {project.technologies && project.technologies.length > 0 && (
                            <div className="technology-tags">
                                {project.technologies.map((tech, index) => (
                                    <span key={index} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {user ? (
                    <div className="join-section">
                        <p>Welcome back, {user.email}!</p>
                        <button 
                            onClick={handleJoinProject} 
                            disabled={isJoining}
                            className="btn btn-primary join-button"
                        >
                            {isJoining ? 'Joining...' : 'Join Project'}
                        </button>
                    </div>
                ) : (
                    <div className="auth-section">
                        <p>Please sign in or create an account to join this project.</p>
                        <div className="auth-buttons">
                            <button 
                                onClick={() => navigate(`/signin?redirect=/project-invitation/${projectId}`)}
                                className="btn btn-primary"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => navigate(`/signup?redirect=/project-invitation/${projectId}`)}
                                className="btn btn-secondary"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                )}

                <div className="invitation-footer">
                    <button onClick={() => navigate('/dashboard')} className="btn btn-outline">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectInvitation; 