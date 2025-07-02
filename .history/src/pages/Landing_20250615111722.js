import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 text-white">
      <div className="text-center space-y-6 transform transition-all duration-500 hover:scale-105">
        <div className="flex items-center justify-center space-x-3">
          <svg
            className="w-12 h-12 animate-spin-slow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a8 8 0 11-16 0 8 8 0 0116 0z"
            />
          </svg>
          <h1 className="text-5xl font-extrabold bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"><img src="project-icon.png" alt="ProjectStack Logo" className="w-16 h-16 inline-block mr-2" />
            ProjectStack
          </h1>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold animate-pulse">
          Start Your Project with ProjectStack
        </h2>
        <button
          onClick={() => navigate('/signup')}
          className="mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 transform hover:scale-110 animate-pulse"
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default Landing;