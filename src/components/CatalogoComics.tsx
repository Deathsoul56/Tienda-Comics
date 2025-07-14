import React from "react";

export type Comic = {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  description: string;
};

interface CatalogoComicsProps {
  comics: Comic[];
}

const CatalogoComics: React.FC<CatalogoComicsProps> = ({ comics }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", padding: "2rem" }}>
      {comics.map((comic) => (
        <div key={comic.id} style={{ background: "#1a1a1a", borderRadius: "12px", boxShadow: "0 2px 8px #0003", padding: "1rem", color: "#fff" }}>
          <img src={comic.image} alt={comic.title} style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }} />
          <h2 style={{ fontSize: "1.3em", margin: "0 0 0.5em 0" }}>{comic.title}</h2>
          <p style={{ margin: "0 0 0.5em 0", fontWeight: "bold" }}>Autor: {comic.author}</p>
          <p style={{ margin: "0 0 0.5em 0" }}>{comic.description}</p>
          <p style={{ fontWeight: "bold", color: "#646cff" }}>${comic.price.toFixed(2)}</p>
          <button style={{ marginTop: "0.5em" }}>Agregar al carrito</button>
        </div>
      ))}
    </div>
  );
};

export default CatalogoComics;
