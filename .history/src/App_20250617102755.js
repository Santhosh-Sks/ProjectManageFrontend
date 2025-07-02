import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import ProjectList from './components/ProjectList';
import Project from './components/Project';
import Login from './components/Login';
import './App.css';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
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