import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const navigate = useNavigate();
    const location = useLocation();

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

    const handleChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 5) {
                const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }
        const { email, password, fullName, username } = location.state || {};
        if (!email || !password || !fullName || !username) {
            setError('Missing signup information. Please sign up again.');
            setLoading(false);
            return;
        }
        try {
            // Step 1: Verify OTP first
            const verifyRes = await fetch('http://localhost:8080/api/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otpString })
            });
            if (!verifyRes.ok) throw new Error('Invalid OTP.');
            
            // Step 2: After OTP is verified, create the user account
            const signupRes = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    fullName, 
                    username,
                    verified: true  // Add this to pass the backend verification check
                })
            });
            if (!signupRes.ok) {
                const data = await signupRes.json().catch(() => ({}));
                setError(data.message || 'Failed to create account.');
                setLoading(false);
                return;
            }
            navigate('/signin');
        } catch (err) {
            setError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setLoading(true);
        const { email } = location.state || {};
        if (!email) {
            setError('Missing email. Please sign up again.');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('http://localhost:8080/api/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!res.ok) throw new Error('Failed to resend OTP.');
            setResendDisabled(true);
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
            setResendDisabled(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="auth-form" style={{
                maxWidth: 400,
                width: '100%',
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                padding: 32,
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: 8 }}>Verify Your Email</h2>
                <p style={{ color: '#666', marginBottom: 24 }}>Enter the 6-digit code sent to your email</p>
                {error && <div style={{ color: '#e74c3c', marginBottom: 16 }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                name={`otp-${index}`}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                maxLength="1"
                                pattern="\d*"
                                inputMode="numeric"
                                required
                                style={{
                                    width: 40,
                                    height: 48,
                                    fontSize: 24,
                                    textAlign: 'center',
                                    border: '1px solid #ccc',
                                    borderRadius: 6,
                                    outline: 'none',
                                    background: '#fafbfc'
                                }}
                                autoComplete="off"
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px 0',
                            background: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            fontWeight: 600,
                            fontSize: 16,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: 16
                        }}
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                    <div>
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={resendDisabled || loading}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#2563eb',
                                cursor: resendDisabled || loading ? 'not-allowed' : 'pointer',
                                textDecoration: 'underline',
                                fontSize: 14
                            }}
                        >
                            {resendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPVerification; 