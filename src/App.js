import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Componentes
import Home from './components/Home';
import Catalog from './components/Catalog';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">Comic Store</Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/catalog" className="nav-link">Catálogo</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
