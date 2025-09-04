import React, { useState } from "react";
import { useComicFilters } from '../hooks/useComicFilters';
import { useCartNotification } from '../hooks/useCartNotification';
import type { Comic } from '../domain/entities';

interface CatalogoComicsProps {
  comics: Comic[];
  onSearch?: (filters: Record<string, unknown>) => void;
  onAddToCart?: (comic: Comic) => void;
  onComicClick?: (comic: Comic) => void;
}

const CatalogoComics: React.FC<CatalogoComicsProps> = ({ comics, onSearch, onComicClick }) => {
  const [order, setOrder] = useState<'position' | 'title_asc' | 'title_desc' | 'price_asc' | 'price_desc' | ''>('');
  const { authors, publishers, genres } = useComicFilters();
  const { notification, buttonStates, addToCart } = useCartNotification();
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
      {/* Notificación flotante */}
      {notification.show && notification.comic && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          backgroundColor: '#1a1a1a',
          border: '2px solid #00e676',
          borderRadius: '16px',
          padding: '1.5rem',
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(0, 230, 118, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: '400px',
          animation: notification.show ? 'slideInRight 0.5s ease-out' : 'slideOutRight 0.3s ease-in',
          transform: notification.show ? 'translateX(0)' : 'translateX(100%)'
        }}>
          <div style={{
            width: '60px',
            height: '80px',
            borderRadius: '8px',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <img
              src={
                notification.comic.image
                  ? notification.comic.image.startsWith('http')
                    ? notification.comic.image
                    : notification.comic.image.startsWith('/')
                      ? notification.comic.image
                      : '/' + notification.comic.image
                  : ''
              }
              alt={notification.comic.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              color: '#00e676',
              fontWeight: 'bold',
              fontSize: '1rem',
              marginBottom: '0.25rem'
            }}>
              ✅ ¡Agregado al carrito!
            </div>
            <div style={{
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: '500',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {notification.comic.title}
            </div>
            <div style={{
              color: '#646cff',
              fontSize: '0.85rem',
              fontWeight: 'bold'
            }}>
              ${notification.comic.price?.toFixed(2)}
            </div>
          </div>
        </div>
      )}
      
      <div style={{ 
        display: 'flex', 
        gap: '2rem',
        maxWidth: '1800px',
        margin: '0 auto',
        padding: '1rem'
      }}>
      {/* Sidebar de filtros */}
      <aside style={{
        width: '280px',
        flexShrink: 0,
        backgroundColor: '#1a1a1a',
        borderRadius: '16px',
        padding: '2rem 1.5rem',
        height: 'fit-content',
        position: 'sticky',
        top: '2rem',
        border: '1px solid #333',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ 
          color: '#fff', 
          marginBottom: '1.5rem', 
          fontSize: '1.3rem', 
          fontWeight: 'bold',
          textAlign: 'center',
          borderBottom: '2px solid #646cff',
          paddingBottom: '0.5rem'
        }}>
          Filtros
        </h3>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Autor */}
          <div>
            <label style={{ 
              color: '#fff', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem', 
              display: 'block',
              fontSize: '0.95rem'
            }}>
              Autor
            </label>
            <select 
              name="author" 
              value={filters.author} 
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #333',
                background: '#222',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#646cff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            >
              <option value="">Todos los autores</option>
              {authors.map((author) => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
          </div>

          {/* Publisher */}
          <div>
            <label style={{ 
              color: '#fff', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem', 
              display: 'block',
              fontSize: '0.95rem'
            }}>
              Editorial
            </label>
            <select 
              name="publisher" 
              value={filters.publisher} 
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #333',
                background: '#222',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#646cff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            >
              <option value="">Todas las editoriales</option>
              {publishers.map((publisher) => (
                <option key={publisher} value={publisher}>{publisher}</option>
              ))}
            </select>
          </div>

          {/* Género */}
          <div>
            <label style={{ 
              color: '#fff', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem', 
              display: 'block',
              fontSize: '0.95rem'
            }}>
              Género
            </label>
            <select 
              name="genre" 
              value={filters.genre} 
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #333',
                background: '#222',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#646cff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            >
              <option value="">Todos los géneros</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div>
            <label style={{ 
              color: '#fff', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem', 
              display: 'block',
              fontSize: '0.95rem'
            }}>
              Rango de precio
            </label>
            <select 
              name="priceRange" 
              value={filters.priceRange} 
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #333',
                background: '#222',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#646cff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <button 
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #646cff 0%, #7c3aed 100%)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(100, 108, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🔍 Buscar
            </button>
            <button 
              type="button" 
              onClick={handleClearFilters}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: '2px solid #646cff',
                background: 'transparent',
                color: '#646cff',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#646cff';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#646cff';
              }}
            >
              🧹 Limpiar filtros
            </button>
          </div>
        </form>
      </aside>

      {/* Contenido principal */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Barra superior */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          backgroundColor: '#1a1a1a',
          padding: '1.5rem 2rem',
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <div style={{ 
            color: '#bbb', 
            fontSize: '1.1rem', 
            fontWeight: 'bold' 
          }}>
            {comics.length} cómics encontrados
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ 
              color: '#fff', 
              fontWeight: 'bold', 
              fontSize: '0.95rem' 
            }}>
              Ordenar por:
            </label>
            <select 
              value={order} 
              onChange={handleOrderChange}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '2px solid #333',
                background: '#222',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                minWidth: '200px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#646cff'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            >
              <option value="position">Posición</option>
              <option value="title_asc">Nombre: A a Z</option>
              <option value="title_desc">Nombre: Z a A</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {/* Grid de cómics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '4rem 1.1rem',
          alignItems: 'start'
        }}>
          {comics.map((comic) => (
            <div
              key={comic.comic_id}
              style={{
                backgroundColor: '#1a1a1a',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #333',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(100, 108, 255, 0.3)';
                e.currentTarget.style.borderColor = '#646cff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#333';
              }}
              onClick={() => onComicClick && onComicClick(comic)}
            >
              {/* Imagen del cómic */}
              <div style={{ 
                width: '100%', 
                aspectRatio: '3/4', 
                marginBottom: '1rem',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#2a2a2a'
              }}>
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
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </div>

              {/* Información del cómic */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  margin: '0 0 0.5rem 0',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {comic.title}
                </h3>

                <p style={{
                  color: '#bbb',
                  fontSize: '0.9rem',
                  margin: '0 0 0.5rem 0',
                  fontWeight: '500'
                }}>
                  {comic.author}
                </p>

                <p style={{
                  color: '#888',
                  fontSize: '0.85rem',
                  margin: '0 0 1rem 0',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  flex: 1
                }}>
                  {comic.description}
                </p>

                {/* Precio y botón */}
                <div style={{ marginTop: 'auto' }}>
                  <div style={{
                    color: '#646cff',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    ${comic.price?.toFixed(2)}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(comic);
                    }}
                    disabled={buttonStates[comic.comic_id] === 'loading'}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: buttonStates[comic.comic_id] === 'success' 
                        ? 'linear-gradient(135deg, #00e676 0%, #00c853 100%)'
                        : buttonStates[comic.comic_id] === 'loading'
                        ? 'linear-gradient(135deg, #666 0%, #888 100%)'
                        : 'linear-gradient(135deg, #646cff 0%, #7c3aed 100%)',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      cursor: buttonStates[comic.comic_id] === 'loading' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      transform: buttonStates[comic.comic_id] === 'success' ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: buttonStates[comic.comic_id] === 'success' 
                        ? '0 4px 20px rgba(0, 230, 118, 0.4)' 
                        : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (buttonStates[comic.comic_id] !== 'loading') {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(100, 108, 255, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (buttonStates[comic.comic_id] !== 'loading') {
                        e.currentTarget.style.transform = buttonStates[comic.comic_id] === 'success' ? 'scale(1.05)' : 'scale(1)';
                        e.currentTarget.style.boxShadow = buttonStates[comic.comic_id] === 'success' 
                          ? '0 4px 20px rgba(0, 230, 118, 0.4)' 
                          : 'none';
                      }
                    }}
                  >
                    {buttonStates[comic.comic_id] === 'loading' && '⏳ Agregando...'}
                    {buttonStates[comic.comic_id] === 'success' && '✅ ¡Agregado!'}
                    {(!buttonStates[comic.comic_id] || buttonStates[comic.comic_id] === 'idle') && 'Agregar al carrito'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      </div>
    </>
  );
};

export default CatalogoComics;