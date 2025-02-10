import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Demo from './pages/Demo';
import DemoProcess from './pages/DemoProcess';
import DemoTryOn from './pages/DemoTryOn';
import DemoRecommendations from './pages/DemoRecommendations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/demo/process" element={<DemoProcess />} />
        <Route path="/demo/try-on" element={<DemoTryOn />} />
        <Route path="/demo/recommendations" element={<DemoRecommendations />} />
      </Routes>
    </Router>
  );
}

export default App;