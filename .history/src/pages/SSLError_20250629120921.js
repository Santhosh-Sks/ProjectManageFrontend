import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SSLError = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to http version of the same URL
        const currentUrl = window.location.href;
        const httpUrl = currentUrl.replace('https:', 'http:');
        
        // Extract project ID from the URL if it exists
        const urlParts = currentUrl.split('/');
        const projectIdIndex = urlParts.findIndex(part => part === 'projects') + 1;
        
        if (projectIdIndex > 0 && urlParts[projectIdIndex]) {
            const projectId = urlParts[projectIdIndex];
            navigate(`/project-invitation/${projectId}`);
        } else {
            // Fallback to dashboard
            window.location.href = httpUrl;
        }
    }, [navigate]);

    return (
        <div className="invitation-container">
            <div className="invitation-card error">
                <h2>Redirecting...</h2>
                <p>Please wait while we redirect you to the secure version of this page.</p>
                <div className="loading-spinner"></div>
            </div>
        </div>
    );
};

export default SSLError; 