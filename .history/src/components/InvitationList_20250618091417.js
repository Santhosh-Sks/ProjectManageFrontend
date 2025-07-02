import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvitationList = ({ projectId }) => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newInvitation, setNewInvitation] = useState({
        email: '',
        projectId: projectId,
        status: 'PENDING'
    });

    useEffect(() => {
        fetchInvitations();
    }, [projectId]);

    const fetchInvitations = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/invitations/project/${projectId}`);
            setInvitations(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch invitations');
            console.error('Error fetching invitations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvitation = async (e) => {
        e.preventDefault();
        try {
            // First create the invitation
            const invitationResponse = await axios.post('http://localhost:8080/api/invitations', newInvitation);
            
            // Then send the invitation email
            await axios.post('http://localhost:8080/api/emails/invitation', {
                toEmail: newInvitation.email,
                projectId: projectId
            });

            setInvitations([...invitations, invitationResponse.data]);
            setNewInvitation({
                email: '',
                projectId: projectId,
                status: 'PENDING'
            });
        } catch (err) {
            setError('Failed to create invitation');
            console.error('Error creating invitation:', err);
        }
    };

    const handleDeleteInvitation = async (id) => {
        if (window.confirm('Are you sure you want to delete this invitation?')) {
            try {
                await axios.delete(`http://localhost:8080/api/invitations/${id}`);
                setInvitations(invitations.filter(inv => inv.id !== id));
            } catch (err) {
                setError('Failed to delete invitation');
                console.error('Error deleting invitation:', err);
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="invitation-list-container">
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleCreateInvitation} className="invitation-form">
                <h3>Invite Team Member</h3>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={newInvitation.email}
                        onChange={(e) => setNewInvitation({...newInvitation, email: e.target.value})}
                        required
                    />
                </div>
                <button type="submit" className="btn">Send Invitation</button>
            </form>

            <div className="invitations-grid">
                {invitations.map(invitation => (
                    <div key={invitation.id} className="invitation-card">
                        <div className="invitation-header">
                            <h3>{invitation.email}</h3>
                            <span className={`status-badge status-${invitation.status.toLowerCase()}`}>
                                {invitation.status}
                            </span>
                        </div>
                        <div className="invitation-meta">
                            <span>Project ID: {invitation.projectId}</span>
                        </div>
                        <div className="invitation-actions">
                            {invitation.status === 'PENDING' && (
                                <button 
                                    onClick={() => handleDeleteInvitation(invitation.id)}
                                    className="btn btn-danger"
                                >
                                    Cancel Invitation
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvitationList; 