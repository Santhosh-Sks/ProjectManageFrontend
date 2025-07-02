import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing'
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import OTPVerify from './pages/OTPVerify';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Landing" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otp-verify" element={<OTPVerify />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;