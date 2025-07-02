import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [step, setStep] = useState(1); // 1: email, 2: otp, 3: signup
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const navigate = useNavigate();

    // Resend OTP timer
    useEffect(() => {
        let timer;
        if (resendDisabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setResendDisabled(false);
            setCountdown(30);
        }
        return () => clearInterval(timer);
    }, [resendDisabled, countdown]);

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setInfo('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) throw new Error('Failed to send OTP.');
            setStep(2);
            setInfo('OTP sent! Please check your email.');
            setResendDisabled(true);
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setInfo('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otp }),
            });
            if (!res.ok) throw new Error('Invalid OTP.');
            setStep(3);
            setInfo('OTP verified! Please complete your registration.');
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Resend OTP
    const handleResendOTP = async () => {
        setError('');
        setInfo('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) throw new Error('Failed to resend OTP.');
            setInfo('OTP resent! Please check your email.');
            setResendDisabled(true);
            setCountdown(30);
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Create Account
    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setInfo('');
        setLoading(true);
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName, username }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to create account.');
            }
            setInfo('Account created! You can now sign in.');
            navigate('/signin');
        } catch (err) {
            setError(err.message);
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
                {step === 1 && (
                    <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{ flex: 1 }}
                            />
                            <button type="submit" disabled={loading} style={{ minWidth: 100 }}>
                                {loading ? 'Sending...' : 'Verify'}
                            </button>
                        </div>
                    </form>
                )}
                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                required
                                style={{ flex: 1 }}
                                maxLength={6}
                            />
                            <button type="submit" disabled={loading} style={{ minWidth: 100 }}>
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={resendDisabled || loading}
                            style={{ marginTop: 8 }}
                        >
                            {resendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                        </button>
                    </form>
                )}
                {step === 3 && (
                    <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>
                )}
                <div className="auth-link" style={{marginTop: '1rem'}}>
                    Already have an account? <Link to="/signin">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
