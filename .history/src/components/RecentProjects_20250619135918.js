import React from 'react';
import { Link } from 'react-router-dom';

const RecentProjects = ({ projects }) => {
    return (
        <div className="recent-projects-container" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
        }}>
            {projects.map((project) => (
                <Link
                    to={`/projects/${project._id || project.id}`}
                    key={project._id || project.id}
                    className="recent-project-card"
                    style={{
                        background: '#f9fafb',
                        borderRadius: '0.8rem',
                        padding: '1rem',
                        boxShadow: '0 1px 5px rgba(0,0,0,0.05)',
                        textDecoration: 'none',
                        color: '#111',
                        transition: 'box-shadow 0.2s ease-in-out',
                        width: '100%',
                        overflowWrap: 'break-word'
                    }}
                >
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{project.title}</h3>
                    <p style={{ marginTop: '0.5rem', color: '#555' }}>{project.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#4f46e5' }}>{project.category}</span>
                        <div style={{ fontSize: '0.85rem', color: '#333' }}>
                            {project.tasks?.length || 0} Tasks • {project.members?.length || 0} Members
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};
