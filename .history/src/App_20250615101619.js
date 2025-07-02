import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp.js';
import SignIn from './pages/SignIn';
import OTPVerify from './pages/OTPVerify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify-otp" element={<OTPVerify />} />
        <Route path="/dashboard" element={<h1>Dashboard (Protected)</h1>} />
      </Routes>
    </>
  );
}

export default App;
