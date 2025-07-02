import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';
import ModalForm from './ModalForm';

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

    const handleOpenModal = () => setShowModal(true);
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
                            <button className="nav-link btn btn-primary" style={{marginRight: '0.5rem'}} onClick={handleOpenModal}>New Project</button>
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
        <ModalForm
            open={showModal}
            onClose={handleCloseModal}
            onSubmit={handleFormSubmit}
            form={form}
            onFormChange={handleFormChange}
            formError={formError}
            formLoading={formLoading}
        />
        </>
    );
};

export default Header; 