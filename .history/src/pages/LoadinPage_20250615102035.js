import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600 text-white">
      <div className="flex items-center space-x-4 mb-6 transform transition-all duration-500 hover:scale-105">
        {/* Placeholder SVG Icon for ProjectStack */}
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6M4 4h16v16H4V4z"
          />
        </svg>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse">
          ProjectStack
        </h1>
      </div>
      <h2 className="text-3xl font-semibold mb-8 text-center max-w-lg">
        Start your project with ProjectStack
      </h2>
      <button
        onClick={() => navigate('/signup')}
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-8 rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 transform hover:scale-105 animate-pulse text-lg font-medium"
      >
        Start
      </button>
    </div>
  );
}

export default LandingPage;