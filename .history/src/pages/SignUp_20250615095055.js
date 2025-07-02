import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signUp } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(signUp(form, navigate));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;
