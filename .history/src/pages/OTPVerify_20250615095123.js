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
    <form onSubmit={handleSubmit}>
      <input placeholder="Enter OTP" value={code} onChange={e => setCode(e.target.value)} required />
      <button type="submit">Verify OTP</button>
    </form>
  );
}

export default OTPVerify;
