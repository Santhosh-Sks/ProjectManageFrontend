import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import OTPVerify from './pages/OTPVerify';
import Landing from './pages/Landing';
import Header from './components/Header';
import './App.css';

function App() {
  const isAuthenticated = true; 

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Header />}
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/dashboard" />} />
            <Route path="/signin" element={!isAuthenticated ? <SignIn /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />} />
            <Route path="/verify-otp" element={!isAuthenticated ? <OTPVerify /> : <Navigate to="/dashboard" />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
            <Route path="/projects/*" element={isAuthenticated ? <Projects /> : <Navigate to="/signin" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;