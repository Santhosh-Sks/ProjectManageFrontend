import React from 'react';
import { Link } from 'react-router-dom';

const RecentProjects = ({ projects }) => {
    return (
        <div className="recent-projects-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {projects.map((project) => (
                <Link
                    to={`/projects/${project._id || project.id}`}
                    key={project._id || project.id}
                    className="recent-project-card"
                    style={{
                        background: '#fff',
                        borderRadius: '1rem',
                        padding: '1.2rem',
                        boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block',
                        transition: 'box-shadow 0.2s',
                    }}
                >
                    <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 600 }}>{project.title}</h3>
                    <p style={{ margin: '0.5rem 0 0.8rem 0', color: '#555' }}>{project.description}</p>
                    <div className="project-meta" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.98rem' }}>
                        <span className="category" style={{ color: '#6366f1', fontWeight: 500 }}>{project.category}</span>
                        <div className="project-stats" style={{ display: 'flex', gap: '1.2rem' }}>
                            <span className="tasks-count">
                                {project.tasks?.length || 0} Tasks
                            </span>
                            <span className="members-count">
                                {project.members?.length || 0} Members
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default RecentProjects; 