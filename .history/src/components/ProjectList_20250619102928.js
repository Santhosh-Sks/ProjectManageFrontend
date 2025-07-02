import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

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
            <div style={{ marginBottom: '1.5rem' }}>
                <button className="btn btn-primary" onClick={handleOpenModal}>New Project</button>
            </div>
            {showModal && (
                <div className="modal-overlay" style={{zIndex: 9999, position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(30,30,60,0.55)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <div className="modal-content" style={{zIndex: 10000, background:'#fff', borderRadius:'1.5rem', boxShadow:'0 8px 32px rgba(99,102,241,0.18)', padding:'2.5rem 2rem', minWidth:320, maxWidth:400, width:'100%', position:'relative'}}>
                        <button className="modal-close" onClick={handleCloseModal} style={{position:'absolute', top:18, right:22, fontSize:'2rem', background:'none', border:'none', color:'#6366f1', cursor:'pointer'}}>×</button>
                        <h2 className="modal-title" style={{textAlign:'center', fontWeight:700, fontSize:'1.7rem', marginBottom:'1.5rem', color:'#6366f1'}}>Create New Project</h2>
                        <form onSubmit={handleFormSubmit} style={{display:'flex', flexDirection:'column', gap:'1.1rem'}}>
                            <input name="title" value={form.title} onChange={handleFormChange} placeholder="Title" style={{padding:'0.8rem', borderRadius:'0.8rem', border:'1.5px solid #d1d5db', fontSize:'1rem'}} />
                            <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description" style={{padding:'0.8rem', borderRadius:'0.8rem', border:'1.5px solid #d1d5db', fontSize:'1rem', minHeight:70}} />
                            <input name="category" value={form.category} onChange={handleFormChange} placeholder="Category" style={{padding:'0.8rem', borderRadius:'0.8rem', border:'1.5px solid #d1d5db', fontSize:'1rem'}} />
                            <input name="technologies" value={form.technologies} onChange={handleFormChange} placeholder="Technologies (comma separated)" style={{padding:'0.8rem', borderRadius:'0.8rem', border:'1.5px solid #d1d5db', fontSize:'1rem'}} />
                            {formError && <div style={{color:'#ef4444', fontSize:'0.95rem', textAlign:'center'}}>{formError}</div>}
                            <button type="submit" className="btn btn-primary" style={{marginTop:'0.5rem', fontSize:'1.1rem', borderRadius:'0.8rem', background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}} disabled={formLoading}>{formLoading ? 'Creating...' : 'Create Project'}</button>
                        </form>
                    </div>
                </div>
            )}
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