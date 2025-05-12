import React from 'react';
import './Catalog.css';

function Catalog() {
  // Datos de ejemplo para el catálogo
  const comics = [
    {
      id: 1,
      title: "Spider-Man",
      price: 19.99,
      image: "https://via.placeholder.com/200x300",
      description: "Las aventuras del amigable vecino Spider-Man"
    },
    {
      id: 2,
      title: "Batman",
      price: 24.99,
      image: "https://via.placeholder.com/200x300",
      description: "El caballero de la noche de Gotham"
    },
    // Puedes agregar más cómics aquí
  ];

  return (
    <div className="catalog">
      <h2>Catálogo de Cómics</h2>
      <div className="comics-grid">
        {comics.map(comic => (
          <div key={comic.id} className="comic-card">
            <img src={comic.image} alt={comic.title} />
            <h3>{comic.title}</h3>
            <p>{comic.description}</p>
            <p className="price">${comic.price}</p>
            <button className="add-to-cart">Agregar al Carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog; 