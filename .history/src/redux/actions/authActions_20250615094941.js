import api from '../../utils/api';
import { toast } from 'react-toastify';

export const signUp = (userData, navigate) => async dispatch => {
  try {
    dispatch({ type: 'AUTH_REQUEST' });
    await api.post('/otp/send', { email: userData.email });
    dispatch({ type: 'SAVE_EMAIL_FOR_OTP', payload: userData.email });
    localStorage.setItem('tempUser', JSON.stringify(userData));
    toast.success('OTP sent!');
    navigate('/verify-otp');
  } catch (err) {
    dispatch({ type: 'AUTH_FAILURE', payload: err.message });
    toast.error('Error sending OTP');
  }
};

export const verifyAndRegister = (code, navigate) => async dispatch => {
  const tempUser = JSON.parse(localStorage.getItem('tempUser'));
  if (!tempUser) {
    toast.error('User info missing. Please sign up again.');
    return;
  }

  try {
    const res = await api.post('/otp/verify', { email: tempUser.email, code });
    if (res.status === 200) {
      const registerRes = await api.post('/auth/signup', tempUser);
      const { token } = registerRes.data;
      localStorage.setItem('token', token);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: tempUser, token } });
      toast.success('Account created!');
      navigate('/dashboard');
    }
  } catch (err) {
    toast.error('OTP verification failed!');
    dispatch({ type: 'AUTH_FAILURE', payload: err.message });
  }
};

export const signIn = (email, password, navigate) => async dispatch => {
  try {
    dispatch({ type: 'AUTH_REQUEST' });
    const res = await api.post('/auth/signin', { email, password });
    const token = res.data;
    localStorage.setItem('token', token);
    dispatch({ type: 'AUTH_SUCCESS', payload: { user: { email }, token } });
    toast.success('Signed in!');
    navigate('/dashboard');
  } catch (err) {
    dispatch({ type: 'AUTH_FAILURE', payload: err.message });
    toast.error('Invalid credentials!');
  }
};
