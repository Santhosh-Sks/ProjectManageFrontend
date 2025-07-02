import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const ProjectList = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        category: '',
        technologies: [],
        createdBy: user?.email || '',
        members: [],
        tasks: []
    });
    const [newTechnology, setNewTechnology] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await projectService.getAllProjects();
            setProjects(data);
        } catch (err) {
            setError('Failed to load projects');
            console.error('Error loading projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const projectData = {
                ...newProject,
                createdBy: user.email,
                members: [user.email], // Add creator as first member
                tasks: []
            };
            
            await projectService.createProject(projectData);
            setNewProject({
                title: '',
                description: '',
                category: '',
                technologies: [],
                createdBy: user.email,
                members: [],
                tasks: []
            });
            loadProjects();
        } catch (err) {
            setError('Failed to create project');
            console.error('Error creating project:', err);
        }
    };

    const handleAddTechnology = () => {
        if (newTechnology.trim()) {
            setNewProject({
                ...newProject,
                technologies: [...newProject.technologies, newTechnology.trim()]
            });
            setNewTechnology('');
        }
    };

    const handleRemoveTechnology = (index) => {
        const updatedTechnologies = newProject.technologies.filter((_, i) => i !== index);
        setNewProject({
            ...newProject,
            technologies: updatedTechnologies
        });
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="project-list-container">
            <h1>Projects</h1>

            <div className="create-project-form">
                <h2>Create New Project</h2>
                <form onSubmit={handleCreateProject}>
                    <input
                        type="text"
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        placeholder="Project title"
                        required
                    />
                    <textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        placeholder="Project description"
                        required
                    />
                    <input
                        type="text"
                        value={newProject.category}
                        onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                        placeholder="Project category"
                        required
                    />
                    <div className="technologies-input">
                        <input
                            type="text"
                            value={newTechnology}
                            onChange={(e) => setNewTechnology(e.target.value)}
                            placeholder="Add technology"
                        />
                        <button type="button" onClick={handleAddTechnology}>Add</button>
                    </div>
                    <div className="technologies-list">
                        {newProject.technologies.map((tech, index) => (
                            <div key={index} className="technology-tag">
                                {tech}
                                <button type="button" onClick={() => handleRemoveTechnology(index)}>×</button>
                            </div>
                        ))}
                    </div>
                    <button type="submit">Create Project</button>
                </form>
            </div>

            <div className="projects-grid">
                {projects.map((project) => (
                    <Link to={`/projects/${project.id}`} key={project.id} className="project-card">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <div className="project-meta">
                            <span className="category">{project.category}</span>
                            <div className="technologies">
                                {project.technologies.map((tech, index) => (
                                    <span key={index} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                            <div className="project-stats">
                                <span className="members-count">{project.members?.length || 0} Members</span>
                                <span className="tasks-count">{project.tasks?.length || 0} Tasks</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProjectList; 