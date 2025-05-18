import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Approve from './components/Approve/Approve';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/approve" element={<Approve />} />
      </Routes>
    </Router>
  );
}

export default App;