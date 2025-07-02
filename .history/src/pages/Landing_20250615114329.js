import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url('/bg-pic.jpg')` }} // Place your background image in public/bg-tech.jpg
    >
      <div className="bg-gray/20 backdrop-blur-3xl p-10 rounded-3xl shadow-2xl border border-color-blue border-white/20 max-w-xl text-center text-black animate-fade-in bg-blue">
        <div className="mb-6">
          <img
            src="/project-icon.png"
            alt="ProjectStack Logo"
            className="w-20 h-20 mx-auto mb-4 animate-fade-in-down"
          />
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 animate-slide-up">
            ProjectStack
          </h1>
        </div>
        <p className="text-lg md:text-xl font-medium mb-8 animate-fade-in ">
          Start your next great idea with us. Manage your team, tasks, and collaboration—effortlessly.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg rounded-xl shadow-md hover:scale-105 transition-all duration-300 animate-bounce"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Landing;
