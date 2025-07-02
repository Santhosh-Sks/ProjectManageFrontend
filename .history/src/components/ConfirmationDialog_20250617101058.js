import React from 'react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-dialog-overlay">
            <div className="confirmation-dialog">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="confirmation-dialog-buttons">
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                    <button onClick={onConfirm} className="confirm-button">Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog; 