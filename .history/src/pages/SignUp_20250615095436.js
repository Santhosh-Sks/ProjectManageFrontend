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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 max-w-md mx-auto mt-10 border rounded shadow">
    <input name="name" className="border p-2 rounded" placeholder="Name" onChange={handleChange} required />
    <input name="username" className="border p-2 rounded" placeholder="Username" onChange={handleChange} required />
    <input name="email" type="email" className="border p-2 rounded" placeholder="Email" onChange={handleChange} required />
    <input name="password" type="password" className="border p-2 rounded" placeholder="Password" onChange={handleChange} required />
    <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign Up</button>
  </form>  
  );
}

export default SignUp;
