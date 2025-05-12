import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Bienvenido a Comic Store</h1>
        <p>Descubre nuestro extenso catálogo de cómics</p>
        <Link to="/catalog" className="cta-button">
          Ver Catálogo
        </Link>
      </div>
    </div>
  );
}

export default Home; 