import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

const SignUp = () => {
    // State hooks to manage form data, errors, and UI state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);

    // React Router hooks for navigation and search params
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // The function to handle the OTP request
    const handleSendOTP = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Reset previous messages and start loading state
        setError('');
        setInfo('');
        setLoading(true);

        // Basic client-side validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // Log for debugging purposes
        console.log('Sending OTP to:', email);

        try {
            // Make the API call to send the OTP
            const res = await fetch(`${API}/api/otp/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            // Log the response for debugging
            console.log('OTP send response status:', res.status);
            // Since the server sends a 204 with no body, we can skip await res.text()
            // to avoid potential issues, or log it if needed.
            // console.log('OTP send response body:', await res.text());

            // Check if the response was successful
            if (!res.ok) {
                // If not okay, throw an error to be caught below
                throw new Error('Failed to send OTP.');
            }

            // Set a success message and then, and here's the key change,
            // delay the navigation to allow the UI to update.
            setInfo('OTP sent successfully! Redirecting you now...');
            
            // Wait for 2 seconds before navigating
            setTimeout(() => {
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
            }, 2000); // Navigate after 2 seconds
            
        } catch (err) {
            // Handle any errors that occurred during the fetch or in the `if (!res.ok)` check
            console.error(err);
            setError('Failed to send OTP. Please try again.');
        } finally {
            // Stop the loading spinner
            // Note: The loading state will be set to false, but a navigation
            // is triggered, so the component will unmount shortly after.
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Create Account</h2>
                {/* Display error and info messages */}
                {error && <div className="error-message">{error}</div>}
                {info && <div className="alert alert-info" style={{ marginTop: '1rem' }}>{info}</div>}
                
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

                <div className="auth-link" style={{ marginTop: '1rem' }}>
                    Already have an account? <Link to="/signin">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
