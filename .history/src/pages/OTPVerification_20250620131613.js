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
            // 1. Verify OTP
            const verifyRes = await fetch('http://localhost:8080/api/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otpString })
            });
            if (!verifyRes.ok) throw new Error('Invalid OTP.');
            // 2. After OTP is verified, send signup data to backend
            const signupRes = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName, username })
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
        <div className="auth-container">
            <div className="auth-form">
                <h2>Verify Your Email</h2>
                <p className="text-center mb-4">Please enter the 6-digit code sent to your email</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="otp-inputs">
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
                                className="otp-input"
                                autoComplete="off"
                            />
                        ))}
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`btn ${loading ? 'loading' : ''}`}
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                    <div className="resend-otp">
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={resendDisabled || loading}
                            className="btn btn-link"
                        >
                            {resendDisabled 
                                ? `Resend OTP in ${countdown}s` 
                                : 'Resend OTP'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPVerification; 