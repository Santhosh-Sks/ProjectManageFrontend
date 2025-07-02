import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const navigate = useNavigate();
    const { verifyOTP, resendOTP } = useAuth();

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

            // Auto-focus next input
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

        try {
            await verifyOTP(otpString);
            navigate('/signin');
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            setResendDisabled(true);
            await resendOTP();
            setError('');
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
            setResendDisabled(false);
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
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <div className="resend-otp">
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={resendDisabled}
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