import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setInfo('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Debug: log the email being sent
        console.log('Sending OTP to:', email);

        try {
            const res = await fetch('http://localhost:8080/api/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            // Debug: log the response status and body
            console.log('OTP send response status:', res.status);
            const text = await res.text();
            console.log('OTP send response body:', text);

            if (!res.ok) throw new Error('Failed to send OTP.');
            setInfo('OTP sent! Please check your email.');
            
            // Get redirect URL if available
            const redirectUrl = searchParams.get('redirect');
            
            navigate('/otpverification', {
                state: { 
                    email, 
                    password, 
                    fullName, 
                    username,
                    redirectUrl 
                }
            });
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Create Account</h2>
                {error && <div className="error-message">{error}</div>}
                {info && <div className="alert alert-info" style={{marginTop: '1rem'}}>{info}</div>}
                <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Sending OTP...' : 'Verify Email'}
                    </button>
                </form>
                <div className="auth-link" style={{marginTop: '1rem'}}>
                    Already have an account? <Link to="/signin">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
