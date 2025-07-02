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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 max-w-md w-full mx-auto mt-10 bg-white border rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Verify OTP</h2>
        <div className="flex flex-col">
          <label htmlFor="otp" className="text-sm font-medium text-gray-600 mb-1">
            OTP Code
          </label>
          <input
            id="otp"
            placeholder="Enter OTP code"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}

export default OTPVerify;