import React, { useEffect, useRef } from 'react';

const ModalForm = ({ open, onClose, onSubmit, form, onFormChange, formError, formLoading }) => {
    const modalRef = useRef();

    useEffect(() => {
        if (!open) return;
        function handleKeyDown(e) {
            if (e.key === 'Escape') onClose();
        }
        function handleClickOutside(e) {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="modal-backdrop"
            aria-modal="true"
            role="dialog"
            tabIndex="-1"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(30, 30, 60, 0.55)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.3s',
            }}
        >
            <div
                ref={modalRef}
                className="modal-form-container"
                style={{
                    background: '#fff',
                    borderRadius: '1.5rem',
                    boxShadow: '0 8px 32px rgba(99,102,241,0.18)',
                    padding: '2.5rem 2rem',
                    minWidth: 320,
                    maxWidth: 400,
                    width: '100%',
                    position: 'relative',
                    zIndex: 1001,
                    animation: 'modalFadeIn 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                <button
                    aria-label="Close modal"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 18,
                        right: 22,
                        fontSize: '2rem',
                        background: 'none',
                        border: 'none',
                        color: '#6366f1',
                        cursor: 'pointer',
                    }}
                >
                    ×
                </button>
                <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.7rem', marginBottom: '1.5rem', color: '#6366f1' }}>
                    Create New Project
                </h2>
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    <label htmlFor="modal-title" style={{ fontWeight: 500 }}>Title</label>
                    <input
                        id="modal-title"
                        name="title"
                        value={form.title}
                        onChange={onFormChange}
                        placeholder="Title"
                        style={{ padding: '0.8rem', borderRadius: '0.8rem', border: '1.5px solid #d1d5db', fontSize: '1rem' }}
                        required
                    />
                    <label htmlFor="modal-description" style={{ fontWeight: 500 }}>Description</label>
                    <textarea
                        id="modal-description"
                        name="description"
                        value={form.description}
                        onChange={onFormChange}
                        placeholder="Description"
                        style={{ padding: '0.8rem', borderRadius: '0.8rem', border: '1.5px solid #d1d5db', fontSize: '1rem', minHeight: 70 }}
                        required
                    />
                    <label htmlFor="modal-category" style={{ fontWeight: 500 }}>Category</label>
                    <input
                        id="modal-category"
                        name="category"
                        value={form.category}
                        onChange={onFormChange}
                        placeholder="Category"
                        style={{ padding: '0.8rem', borderRadius: '0.8rem', border: '1.5px solid #d1d5db', fontSize: '1rem' }}
                        required
                    />
                    <label htmlFor="modal-technologies" style={{ fontWeight: 500 }}>Technologies</label>
                    <input
                        id="modal-technologies"
                        name="technologies"
                        value={form.technologies}
                        onChange={onFormChange}
                        placeholder="Technologies (comma separated)"
                        style={{ padding: '0.8rem', borderRadius: '0.8rem', border: '1.5px solid #d1d5db', fontSize: '1rem' }}
                    />
                    {formError && <div style={{ color: '#ef4444', fontSize: '0.95rem', textAlign: 'center' }}>{formError}</div>}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ marginTop: '0.5rem', fontSize: '1.1rem', borderRadius: '0.8rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                        disabled={formLoading}
                    >
                        {formLoading ? 'Creating...' : 'Create Project'}
                    </button>
                </form>
            </div>
            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: translateY(40px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @media (max-width: 500px) {
                    .modal-form-container {
                        min-width: 0 !important;
                        max-width: 95vw !important;
                        padding: 1.2rem 0.7rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ModalForm; 