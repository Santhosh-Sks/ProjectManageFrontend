import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signIn } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(signIn(form.email, form.password, navigate));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
      <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
      <button type="submit">Sign In</button>
    </form>
  );
}

export default SignIn;
