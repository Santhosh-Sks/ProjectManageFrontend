import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;

const InvitationList = ({ projectId }) => {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('createdAt');
    const [searchQuery, setSearchQuery] = useState('');
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
            const response = await axios.get(`${API_BASE}/api/invitations/project/${projectId}`);
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
            const invitationResponse = await axios.post(`${API_BASE}/api/invitations`, newInvitation);

            await axios.post(`${API_BASE}/api/emails/invitation`, {
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
                await axios.delete(`${API_BASE}/api/invitations/${id}`);
                setInvitations(invitations.filter(inv => inv.id !== id));
            } catch (err) {
                setError('Failed to delete invitation');
                console.error('Error deleting invitation:', err);
            }
        }
    };

    const handleResendInvitation = async (invitation) => {
        try {
            await axios.post(`${API_BASE}/api/emails/invitation`, {
                toEmail: invitation.email,
                projectId: invitation.projectId
            });
            alert('Invitation resent successfully!');
        } catch (err) {
            setError('Failed to resend invitation');
            console.error('Error resending invitation:', err);
        }
    };

    const filteredInvitations = invitations.filter(invitation => {
        const matchesFilter = filter === 'ALL' || invitation.status === filter;
        const matchesSearch = invitation.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const sortedInvitations = [...filteredInvitations].sort((a, b) => {
        switch (sortBy) {
            case 'email':
                return a.email.localeCompare(b.email);
            case 'status':
                return a.status.localeCompare(b.status);
            case 'createdAt':
                return new Date(b.createdAt) - new Date(a.createdAt);
            default:
                return 0;
        }
    });

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

            <div className="invitation-controls">
                <div className="search-filter-controls">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="ALL">All Invitations</option>
                        <option value="PENDING">Pending</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="DECLINED">Declined</option>
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="createdAt">Sort by Date</option>
                        <option value="email">Sort by Email</option>
                        <option value="status">Sort by Status</option>
                    </select>
                </div>
            </div>

            <form onSubmit={handleCreateInvitation} className="invitation-form">
                <h3>Invite Team Member</h3>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={newInvitation.email}
                        onChange={(e) => setNewInvitation({ ...newInvitation, email: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn">Send Invitation</button>
            </form>

            <div className="invitations-grid">
                {sortedInvitations.map(invitation => (
                    <div key={invitation.id} className="invitation-card">
                        <div className="invitation-header">
                            <h3>{invitation.email}</h3>
                            <span className={`status-badge status-${invitation.status.toLowerCase()}`}>
                                {invitation.status}
                            </span>
                        </div>
                        <div className="invitation-meta">
                            <span>Project ID: {invitation.projectId}</span>
                            <span>Created: {new Date(invitation.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="invitation-actions">
                            {invitation.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => handleResendInvitation(invitation)}
                                        className="btn btn-secondary"
                                    >
                                        Resend
                                    </button>
                                    <button
                                        onClick={() => handleDeleteInvitation(invitation.id)}
                                        className="btn btn-danger"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvitationList;
