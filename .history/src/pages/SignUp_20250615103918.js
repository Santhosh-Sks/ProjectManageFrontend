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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600">
      <div className="relative bg-white bg-opacity-90 backdrop-blur-lg p-8 max-w-md w-full rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6 animate-pulse">
          Sign Up
        </h2>
        <div className="flex flex-col mb-4">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Enter your name"
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            id="username"
            name="username"
            placeholder="Choose a username"
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
          />
        </div>
        <div className="flex flex-col mb-6">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
          />
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 transform hover:scale-105 animate-pulse"
        >
          Sign Up
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/signin" className="text-blue-400 hover:text-blue-500 font-medium transition-colors duration-200">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;