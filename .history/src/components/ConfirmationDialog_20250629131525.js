import React from 'react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    };

    const dialogStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center'
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px'
    };

    const buttonStyle = {
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px'
    };

    const cancelButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#6c757d',
        color: 'white'
    };

    const confirmButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#dc3545',
        color: 'white'
    };

    return (
        <div style={overlayStyle}>
            <div style={dialogStyle}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div style={buttonContainerStyle}>
                    <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
                    <button onClick={onConfirm} style={confirmButtonStyle}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog; 