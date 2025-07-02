import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectRedirect = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to the frontend invitation page
        navigate(`/project-invitation/${projectId}`);
    }, [projectId, navigate]);

    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Redirecting to project invitation...</p>
        </div>
    );
};

export default ProjectRedirect; 