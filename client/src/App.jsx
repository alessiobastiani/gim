import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import SingInCard from './components/SignInCard'

function App() {
  return (
        <Router>
          <Routes>
              {/* Define la ruta para el Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<SingInCard />}/>
          </Routes>
        </Router>
  );
}

export default App;
