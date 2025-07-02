import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import OTPVerification from './pages/OTPVerification';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import Project from './pages/Project';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }
  
  return user ? children : <Navigate to="/signin" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }
  
  return !user ? children : <Navigate to="/dashboard" />;
};

const AppContent = () => {
  const { user } = useAuth();
  const location = window.location.pathname;
  const isLandingPage = location === '/';

  return (
    <div className="app-container">
      {!isLandingPage && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route 
            path="/signin" 
            element={
              <PublicRoute>
                <SignIn />
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
            path="/verify-otp" 
            element={
              <PublicRoute>
                <OTPVerification />
              </PublicRoute>
            } 
          />
          <Route 
            path="/otpverification" 
            element={
              <PublicRoute>
                <OTPVerification />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <div className="dashboard-container">
                  <Dashboard />
                </div>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <PrivateRoute>
                <div className="project-list-container">
                  <ProjectList />
                </div>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/projects/:id" 
            element={
              <PrivateRoute>
                <div className="project-detail-container">
                  <Project />
                </div>
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;