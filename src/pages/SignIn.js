import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { signin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await signin(email, password);
            console.log('Sign in response:', response); // Debug log
            
            if (response?.token) {
                // Check for redirect URL
                const redirectUrl = searchParams.get('redirect');
                if (redirectUrl) {
                    navigate(redirectUrl);
                } else {
                    // Default navigation to dashboard
                    navigate('/dashboard');
                }
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            console.error('Sign in error:', err);
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Sign In</h2>
                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                            aria-describedby={error ? "email-error" : undefined}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                            aria-describedby={error ? "password-error" : undefined}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={loading ? 'loading' : ''}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <div className="auth-link">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;