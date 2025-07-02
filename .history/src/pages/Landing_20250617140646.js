import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen relative">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("bg-pic.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>

            {/* Content */}
            <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl w-full space-y-8 text-center">
                    {/* Logo and Title */}
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <img 
                                src="/public/project-icon.png" 
                                alt="ProjectStack Logo" 
                                className="h-16 w-16 animate-bounce"
                            />
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
                            ProjectStack
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-200 max-w-2xl mx-auto">
                            Streamline your project management with our powerful collaboration platform
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition-transform">
                            <div className="text-blue-400 text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Project Tracking</h3>
                            <p className="text-gray-200">Monitor progress and manage tasks efficiently</p>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition-transform">
                            <div className="text-blue-400 text-4xl mb-4">👥</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Team Collaboration</h3>
                            <p className="text-gray-200">Work together seamlessly with your team</p>
                        </div>
                        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 transform hover:scale-105 transition-transform">
                            <div className="text-blue-400 text-4xl mb-4">📈</div>
                            <h3 className="text-xl font-semibold text-white mb-2">Analytics</h3>
                            <p className="text-gray-200">Get insights into your project performance</p>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
                        <Link
                            to="/signup"
                            className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
