import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { verifyAndRegister } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';

function OTPVerify() {
  const [code, setCode] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(verifyAndRegister(code, navigate));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-600">
      <div className="relative bg-white bg-opacity-90 backdrop-blur-lg p-8 max-w-md w-full rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6 animate-pulse">
          Verify OTP
        </h2>
        <div className="flex flex-col mb-6">
          <label htmlFor="otp" className="text-sm font-medium text-gray-700 mb-2">
            OTP Code
          </label>
          <input
            id="otp"
            name="otp"
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg bg-gray-50 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
          />
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 transform hover:scale-105 animate-pulse"
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default OTPVerify;