import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    // Modal state for new project
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        technologies: '',
    });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Don't show header on landing page
    if (location.pathname === '/') {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleNewProject = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleProjects = () => navigate('/projects');

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
            // Optionally, trigger a refresh in dashboard/project list
            if (location.pathname === '/dashboard') {
                window.location.reload();
            }
        } catch (err) {
            setFormError('Failed to create project.');
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <>
        <header className="app-header">
            <div className="header-content">
                <Link to="/" className="logo">
                    <div className="logo-container">
                        <img 
                            src="/project-icon.png" 
                            alt="ProjectStack Logo" 
                            className="logo-icon"
                        />
                        <h1 className="logo-text">ProjectStack</h1>
                    </div>
                </Link>
                <nav className="main-nav">
                    {user ? (
                        <>
                            <button className="nav-link btn btn-primary" style={{marginRight: '0.5rem'}} onClick={handleNewProject}>New Project</button>
                            <button className="nav-link btn btn-secondary" style={{marginRight: '1.5rem'}} onClick={handleProjects}>Projects</button>
                            <button onClick={handleLogout} className="nav-link logout-button">
                                Logout
                            </button>
                            <button 
                                onClick={toggleTheme} 
                                className="theme-toggle"
                                aria-label="Toggle dark mode"
                            >
                                {isDarkMode ? '🌞' : '🌙'}
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={toggleTheme} 
                            className="theme-toggle"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? '🌞' : '🌙'}
                        </button>
                    )}
                </nav>
            </div>
        </header>
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
        </>
    );
};

export default Header; 