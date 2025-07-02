import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';
import LoadingSpinner from '../components/LoadingSpinner';

const ProjectInvitation = () => {
    const { projectId } = useParams();
    const { user, signin } = useAuth();
    const navigate = useNavigate();
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
            // Add current user to project members
            await projectService.addMemberToProject(projectId, user.email);
            // Redirect to project dashboard
            navigate(`/projects/${projectId}`);
        } catch (err) {
            setError('Failed to join project. Please try again.');
        } finally {
            setIsJoining(false);
        }
    };

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
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <div className="project-meta">
                        <span className="category">{project.category}</span>
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