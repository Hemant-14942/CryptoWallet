import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Login';
import WalletDashboard from '../components/WalletDashboard';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className='flex flex-col'>
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/walletdashboard' element={<WalletDashboard />} />
      </Routes>
    </div>
  );
};

export default App;
