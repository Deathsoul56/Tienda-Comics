import React, { useState } from "react";
import { useComicFilters } from '../hooks/useComicFilters';

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
  onSearch?: (filters: any) => void;
}

const CatalogoComics: React.FC<CatalogoComicsProps> = ({ comics, onSearch }) => {
  const { authors, publishers, genres } = useComicFilters();
  const initialFilters = {
    author: '',
    publisher: '',
    genre: '',
    priceRange: ''
  };
  const [filters, setFilters] = useState(initialFilters);
  const priceRanges = [
    { label: 'Todos', value: '' },
    { label: '0 - 5', value: '0-5' },
    { label: '5 - 10', value: '5-10' },
    { label: '10 - 15', value: '10-15' },
    { label: '15 - 20', value: '15-20' },
    { label: '20+', value: '20-1000' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(filters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    if (onSearch) onSearch(initialFilters);
  };

  return (
    <>
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <select name="author" value={filters.author} onChange={handleInputChange}>
          <option value="">Autor</option>
          {authors.map((author) => (
            <option key={author} value={author}>{author}</option>
          ))}
        </select>
        <select name="publisher" value={filters.publisher} onChange={handleInputChange}>
          <option value="">Publicador</option>
          {publishers.map((publisher) => (
            <option key={publisher} value={publisher}>{publisher}</option>
          ))}
        </select>
        <select name="genre" value={filters.genre} onChange={handleInputChange}>
          <option value="">Género</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <select name="priceRange" value={filters.priceRange} onChange={handleInputChange}>
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
        <button type="submit" className="btn-modern">Buscar</button>
        <button
          type="button"
          onClick={handleClearFilters}
          className="btn-modern"
        >
          Borrar filtros
        </button>
      </form>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", padding: "2rem" }}>
        {comics.map((comic) => (
          <div key={comic.id} style={{ background: "#1a1a1a", borderRadius: "12px", boxShadow: "0 2px 8px #0003", padding: "1rem", color: "#fff" }}>
            <img src={comic.image} alt={comic.title} style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }} />
            <h2 style={{ fontSize: "1.3em", margin: "0 0 0.5em 0" }}>{comic.title}</h2>
            <p style={{ margin: "0 0 0.5em 0", fontWeight: "bold" }}>Autor: {comic.author}</p>
            <p style={{ margin: "0 0 0.5em 0" }}>{comic.description}</p>
            <p style={{ fontWeight: "bold", color: "#646cff" }}>${comic.price.toFixed(2)}</p>
            <button className="btn-modern" style={{ marginTop: '0.5em' }}>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default CatalogoComics;
