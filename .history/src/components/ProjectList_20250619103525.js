import React, { useState, useEffect, useRef } from 'react';
import { projectService } from '../services/projectService';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import ModalForm from './ModalForm';

const ProjectList = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        technologies: '',
    });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const popoverRef = useRef();
    const buttonRef = useRef();

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        if (!showModal) return;
        function handleClickOutside(event) {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowModal(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showModal]);

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

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!form.title || !form.description || !form.category) {
            setFormError('All fields are required.');
            return;
        }
        setFormLoading(true);
        try {
            await projectService.createProject({
                title: form.title,
                description: form.description,
                category: form.category,
                technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
                createdBy: user?.email,
                members: [user?.email],
                tasks: []
            });
            setShowModal(false);
            setForm({ title: '', description: '', category: '', technologies: '' });
            loadProjects();
        } catch (err) {
            setFormError('Failed to create project.');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="project-list-container">
            <h1>Projects</h1>
            <div style={{ marginBottom: '1.5rem', position: 'relative', display: 'inline-block' }}>
                <button className="btn btn-primary" onClick={handleOpenModal} ref={buttonRef}>New Project</button>
                <ModalForm
                    open={showModal}
                    onClose={handleCloseModal}
                    onSubmit={handleFormSubmit}
                    form={form}
                    onFormChange={handleFormChange}
                    formError={formError}
                    formLoading={formLoading}
                />
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