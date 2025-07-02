import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { verifyOTP } = useAuth();

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
                                maxLength="1"
                                pattern="\d*"
                                inputMode="numeric"
                                required
                            />
                        ))}
                    </div>
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OTPVerification; 