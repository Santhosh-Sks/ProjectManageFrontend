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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 max-w-md w-full mx-auto mt-10 bg-white border rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-600 mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Enter your name"
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="username" className="text-sm font-medium text-gray-600 mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            placeholder="Choose a username"
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          Sign Up
        </button>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/signin" className="text-blue-600 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}

export default SignUp;