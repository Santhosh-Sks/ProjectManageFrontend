import React from 'react';
import { Link } from 'react-router-dom';

const RecentProjects = ({ projects }) => {
    return (
        <div className="recent-projects">
            {projects.map((project) => (
                <Link to={`/projects/${project._id}`} key={project._id} className="project-card">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-meta">
                        <span className="category">{project.category}</span>
                        <div className="project-stats">
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