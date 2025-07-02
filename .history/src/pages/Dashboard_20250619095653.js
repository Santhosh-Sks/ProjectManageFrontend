import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import LoadingSpinner from '../components/LoadingSpinner';
import RecentProjects from '../components/RecentProjects';
import TaskOverview from '../components/TaskOverview';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recentProject, setRecentProject] = useState(null);
    const [taskStatus, setTaskStatus] = useState({
        todo: 0,
        inProgress: 0,
        done: 0
    });
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        technologies: '',
    });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const projects = await projectService.getAllProjects();
            // Sort by createdAt if available, else reverse
            let sorted = projects;
            if (projects.length && projects[0].createdAt) {
                sorted = projects.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else {
                sorted = projects.slice().reverse();
            }
            setRecentProject(sorted[0] || null);

            const tasks = await taskService.getAllTasks();
            setTaskStatus({
                todo: tasks.filter(task => task.status === 'TODO').length,
                inProgress: tasks.filter(task => task.status === 'IN_PROGRESS').length,
                done: tasks.filter(task => task.status === 'DONE').length
            });
            setError(null);
        } catch (err) {
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
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
            loadDashboardData();
        } catch (err) {
            setFormError('Failed to create project.');
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="dashboard-container">
            <div style={{display:'flex', justifyContent:'flex-end', gap:'1rem', marginBottom:'2rem'}}>
                <button className="btn btn-primary" onClick={handleNewProject}>New Project</button>
                <button className="btn btn-secondary" onClick={handleProjects}>Projects</button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="dashboard-main-grid">
                <div className="dashboard-panel">
                    <h2>Most Recent Project</h2>
                    {recentProject ? (
                        <RecentProjects projects={[recentProject]} />
                    ) : (
                        <div>No projects found.</div>
                    )}
                </div>
                <div className="dashboard-panel">
                    <h2>Task Overview</h2>
                    <TaskOverview taskStatus={taskStatus} />
                </div>
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
        </div>
    );
};

export default Dashboard;
