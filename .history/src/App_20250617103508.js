import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import ProjectList from './components/ProjectList';
import Project from './components/Project';
import './App.css';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/signin" />;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route 
                path="/" 
                element={
                    <PublicRoute>
                        <Landing />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/signup" 
                element={
                    <PublicRoute>
                        <SignUp />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/signin" 
                element={
                    <PublicRoute>
                        <SignIn />
                    </PublicRoute>
                } 
            />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/projects"
                element={
                    <ProtectedRoute>
                        <ProjectList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/projects/:id"
                element={
                    <ProtectedRoute>
                        <Project />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <div className="app">
                    <Header />
                    <main className="main-content">
                        <AppRoutes />
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;