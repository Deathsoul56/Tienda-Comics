import React, { useState } from "react";
import { useComicFilters } from '../hooks/useComicFilters';

export type Comic = {
  comic_id: number;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  publication_date: string;
  price: number;
  stock_quantity: number;
  sold_quantity: number;
  review_quantity: number;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
};

interface CatalogoComicsProps {
  comics: Comic[];
  onSearch?: (filters: any) => void;
  onAddToCart?: (comic: Comic) => void;
  onComicClick?: (comic: Comic) => void;
}

const CatalogoComics: React.FC<CatalogoComicsProps> = ({ comics, onSearch, onAddToCart, onComicClick }) => {
  const [order, setOrder] = useState<'position' | 'title_asc' | 'title_desc' | 'price_asc' | 'price_desc' | ''>('');
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
    if (onSearch) onSearch({ ...filters, order });
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as typeof order;
    setOrder(value);
    if (onSearch) onSearch({ ...filters, order: value });
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    if (onSearch) onSearch(initialFilters);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', marginTop: '2rem' }}>
        <aside style={{ minWidth: 260, background: '#181818', borderRadius: 12, padding: '2rem 1rem', boxShadow: '0 2px 8px #0003', color: '#fff' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Autor</label>
            <select name="author" value={filters.author} onChange={handleInputChange}>
              <option value="">Todos</option>
              {authors.map((author) => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
            <label style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Publicador</label>
            <select name="publisher" value={filters.publisher} onChange={handleInputChange}>
              <option value="">Todos</option>
              {publishers.map((publisher) => (
                <option key={publisher} value={publisher}>{publisher}</option>
              ))}
            </select>
            <label style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Género</label>
            <select name="genre" value={filters.genre} onChange={handleInputChange}>
              <option value="">Todos</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <label style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Precio</label>
            <select name="priceRange" value={filters.priceRange} onChange={handleInputChange}>
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            <button type="submit" className="btn-modern">Buscar</button>
            <button type="button" onClick={handleClearFilters} className="btn-modern">Borrar filtros</button>
          </form>
        </aside>
        <section style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 1rem 0' }}>
            <div style={{ color: '#bbb', fontSize: '1.1em', fontWeight: 'bold' }}>{`Muestra ${comics.length} de ${comics.length} cómics`}</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <label htmlFor="orderSelect" style={{ color: '#fff', fontWeight: 'bold', marginBottom: '0.3rem' }}>Ordenar por</label>
              <select id="orderSelect" value={order} onChange={handleOrderChange} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #646cff', minWidth: '180px', background: '#222', color: '#fff', fontWeight: 'bold' }}>
                <option value="position">Posición</option>
                <option value="title_asc">Nombre: A a Z</option>
                <option value="title_desc">Nombre: Z a A</option>
                <option value="price_asc">Precio: de menor a mayor</option>
                <option value="price_desc">Precio: de mayor a menor</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3rem", padding: "3rem 2rem", background: "#222", borderRadius: "18px" }}>
            {comics.map((comic) => {
              // Validación: ¿ya está en el carrito?
              const isInCart = typeof window !== 'undefined' && (() => {
                try {
                  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                  return cart.some((item: any) => item.comic_id === comic.comic_id);
                } catch {
                  return false;
                }
              })();
              return (
                <div
                  key={comic.comic_id}
                  style={{
                    background: "#1a1a1a",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px #0003",
                    padding: "1rem",
                    color: "#fff",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    marginBottom: '2rem',
                    transition: 'box-shadow 0.2s, border 0.2s',
                    border: '2px solid transparent',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px #646cff99';
                    (e.currentTarget as HTMLDivElement).style.border = '2px solid #646cff';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px #0003';
                    (e.currentTarget as HTMLDivElement).style.border = '2px solid transparent';
                  }}
                  onClick={() => onComicClick && onComicClick(comic)}
                >
                  <div>
                    <img
                      src={
                        comic.image
                          ? comic.image.startsWith('http')
                            ? comic.image
                            : comic.image.startsWith('/')
                              ? comic.image
                              : '/' + comic.image
                          : ''
                      }
                      alt={comic.title || 'Comic'}
                      style={{ width: "100%", borderRadius: "8px", marginBottom: "1rem" }}
                    />
                    <h2 style={{ fontSize: "1.3em", margin: "0 0 0.5em 0" }}>{comic.title}</h2>
                    <p style={{ margin: "0 0 0.5em 0", fontWeight: "bold" }}>Autor: {comic.author}</p>
                    <p style={{ margin: "0 0 0.5em 0" }}>{comic.description}</p>
                    <p style={{ fontWeight: "bold", color: "#646cff" }}>${comic.price?.toFixed(2)}</p>
                  </div>
                  <button
                    className="btn-modern"
                    style={{ marginTop: '1em', opacity: isInCart ? 0.6 : 1, cursor: isInCart ? 'not-allowed' : 'pointer', alignSelf: 'stretch' }}
                    disabled={isInCart}
                    onClick={e => {
                      e.stopPropagation();
                      if (isInCart) {
                        alert('Este cómic ya está en el carrito');
                        return;
                      }
                      onAddToCart && onAddToCart(comic);
                    }}
                  >
                    {isInCart ? 'Ya en el carrito' : 'Agregar al carrito'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
};

export default CatalogoComics;
