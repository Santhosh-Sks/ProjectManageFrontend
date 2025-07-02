import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { useAuth } from '../contexts/AuthContext';

const ProjectList = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        category: '',
        technologies: []
    });
    const [newTechnology, setNewTechnology] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteDialog, setDeleteDialog] = useState({
        isOpen: false,
        projectId: null
    });

    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        loadProjects();
    }, [currentPage]);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getAllProjects();
            setProjects(data);
            setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
            setError(null);
        } catch (err) {
            setError('Failed to load projects. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await projectService.createProject(newProject);
            setNewProject({
                title: '',
                description: '',
                category: '',
                technologies: []
            });
            setNewTechnology('');
            loadProjects();
        } catch (err) {
            setError('Failed to create project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            setLoading(true);
            await projectService.deleteProject(projectId);
            loadProjects();
        } catch (err) {
            setError('Failed to delete project. Please try again.');
        } finally {
            setLoading(false);
            setDeleteDialog({ isOpen: false, projectId: null });
        }
    };

    const handleAddTechnology = () => {
        if (newTechnology.trim()) {
            setNewProject(prev => ({
                ...prev,
                technologies: [...prev.technologies, newTechnology.trim()]
            }));
            setNewTechnology('');
        }
    };

    const handleRemoveTechnology = (techToRemove) => {
        setNewProject(prev => ({
            ...prev,
            technologies: prev.technologies.filter(tech => tech !== techToRemove)
        }));
    };

    // Filter projects by current user
    const userProjects = projects.filter(project => project.createdBy === user?.email);
    const paginatedProjects = userProjects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading && projects.length === 0) {
        return <LoadingSpinner />;
    }
    if (!user) {
        return <LoadingSpinner />;
    }

    return (
        <div className="projects-container">
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            <div className="create-project-form">
                <h2>Create New Project</h2>
                <form onSubmit={handleCreateProject}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={newProject.title}
                            onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={newProject.description}
                            onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <input
                            type="text"
                            id="category"
                            value={newProject.category}
                            onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Technologies</label>
                        <div className="technology-input">
                            <input
                                type="text"
                                value={newTechnology}
                                onChange={(e) => setNewTechnology(e.target.value)}
                                placeholder="Add a technology"
                            />
                            <button type="button" onClick={handleAddTechnology}>Add</button>
                        </div>
                        <div className="technologies">
                            {newProject.technologies.map((tech, index) => (
                                <span key={tech + index} className="tech-tag">{tech}</span>
                            ))}
                        </div>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>
                </form>
            </div>

            <div className="projects-grid">
                {paginatedProjects.filter(project => project._id).map(project => (
                    <div key={project._id} className="project-card">
                        <Link to={`/projects/${project._id}`}>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="project-meta">
                                <span className="category">{project.category}</span>
                                <div className="project-stats">
                                    <span className="tasks-count">
                                        {project.tasks?.length || 0} tasks
                                    </span>
                                    <span className="members-count">
                                        {project.members?.length || 0} members
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <button
                            className="delete-button"
                            onClick={() => setDeleteDialog({ isOpen: true, projectId: project._id })}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            <ConfirmationDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, projectId: null })}
                onConfirm={() => handleDeleteProject(deleteDialog.projectId)}
                title="Delete Project"
                message="Are you sure you want to delete this project? This action cannot be undone."
            />
        </div>
    );
};

export default ProjectList; 