import React from "react";

const HomePage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <h1 style={{ color: "#646cff", fontSize: "2.5em", marginBottom: "1rem" }}>Bienvenido a la Tienda de Cómics</h1>
      <p style={{ fontSize: "1.2em", color: "#fff", marginBottom: "2rem" }}>
        Explora nuestro catálogo, revisa tus ventas y disfruta de los mejores cómics.
      </p>
      <img src="/vite.svg" alt="Logo" style={{ width: "120px", marginBottom: "2rem" }} />
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
        <button className="btn-modern" onClick={() => window.dispatchEvent(new CustomEvent('changeVista', { detail: 'catalogo' }))}>Ver Catálogo</button>
        <button className="btn-modern" onClick={() => window.dispatchEvent(new CustomEvent('changeVista', { detail: 'ventas' }))}>Ver Ventas</button>
      </div>
    </div>
  );
};

export default HomePage;
