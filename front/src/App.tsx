import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Index from './pages/Index';
import GymLeader from './pages/GymLeader';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/gymleader" element={<GymLeader />} />
    </Routes>
  );
};

export default App;