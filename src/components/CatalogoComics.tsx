import React, { useState } from "react";
import { useComicFilters } from '../hooks/useComicFilters';
import type { Comic } from '../domain/entities';
import { container } from '../infrastructure/DependencyContainer';

interface CatalogoComicsProps {
  comics: Comic[];
  onSearch?: (filters: Record<string, unknown>) => void;
  onAddToCart?: (comic: Comic) => void;
  onComicClick?: (comic: Comic) => void;
}

const CatalogoComics: React.FC<CatalogoComicsProps> = ({ comics, onSearch, onComicClick }) => {
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

  const handleAddToCart = async (comic: Comic) => {
    try {
      await container.cartUseCase.addToCart(comic);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="catalogo-panoramico">
      <div style={{ width: '100vw', maxWidth: '100vw', margin: 0, padding: 0, boxSizing: 'border-box', display: 'block' }}>
        <aside className="catalogo-sidebar-flotante">
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
            <button type="button" className="btn-modern" style={{ background: '#222', color: '#fff', border: '1px solid #646cff' }} onClick={handleClearFilters}>Borrar filtros</button>
          </form>
        </aside>
        {/* Fila de controles: contador a la izquierda, ordenar a la derecha */}
        <div style={{
          marginLeft: '90px',
          marginTop: '2rem',
          marginBottom: '1.5rem',
          paddingLeft: 0,
          paddingRight: '23vw',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 'auto',
          maxWidth: 'calc(100vw - 90px - 2vw)'
        }}>
          <div style={{ color: '#bbb', fontSize: '1.1em', fontWeight: 'bold' }}>{`Muestra ${comics.length} de ${comics.length} cómics`}</div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="orderSelect" style={{ color: '#fff', fontWeight: 'bold', marginBottom: 0 }}>Ordenar por</label>
            <select id="orderSelect" value={order} onChange={handleOrderChange} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #646cff', minWidth: '180px', background: '#222', color: '#fff', fontWeight: 'bold' }}>
              <option value="position">Posición</option>
              <option value="title_asc">Nombre: A a Z</option>
              <option value="title_desc">Nombre: Z a A</option>
              <option value="price_asc">Precio: de menor a mayor</option>
              <option value="price_desc">Precio: de mayor a menor</option>
            </select>
          </div>
        </div>
        {/* Grid de productos panorámico */}
        <section className="catalogo-grid-panoramico">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            width: '100%',
            alignItems: 'stretch',
            justifyItems: 'center',
            paddingBottom: '2rem',
          }}>
            {comics.map((comic) => {
              // Esta validación se puede remover o simplificar ya que el use case maneja la lógica
              const isInCart = false; // Simplificado por ahora
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
                    style={{ marginTop: '1em', opacity: isInCart ? 1 : 1, cursor: 'pointer', alignSelf: 'stretch' }}
                    onClick={e => {
                      e.stopPropagation();
                      handleAddToCart(comic);
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CatalogoComics;
