import React, { useEffect, useState } from "react";
import { useCartNotification } from '../hooks/useCartNotification';
import type { Comic } from "../domain/entities";

interface Review {
  review_id: number;
  comic_id: number;
  user_id: string;
  user_name?: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface ComicDetailProps {
  comic: Comic;
  onBack?: () => void;
}

const ComicDetail: React.FC<ComicDetailProps> = ({ comic, onBack }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;
  const { notification, buttonStates, addToCart } = useCartNotification();

  const paginatedReviews = reviews.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (comic?.comic_id) {
      fetch(`${API_BASE_URL}/reviews/${comic.comic_id}`)
        .then(res => res.json())
        .then(data => {
          // Si la respuesta es un objeto con la propiedad 'reviews', usar esa, si no, usar el array directamente
          if (Array.isArray(data)) {
            setReviews(data);
          } else if (Array.isArray(data.reviews)) {
            setReviews(data.reviews);
          } else {
            setReviews([]);
          }
        })
        .catch(() => setReviews([]));
    }
  }, [comic?.comic_id, API_BASE_URL]);

  if (!comic) return <div style={{ color: '#fff', padding: '2rem' }}>Cómic no encontrado.</div>;
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
      
      <div style={{ maxWidth: 900, margin: '2rem auto', background: '#222', borderRadius: 18, padding: '2rem', color: '#fff', boxShadow: '0 2px 16px #0005' }}>
        <button onClick={onBack} style={{ marginBottom: '1.5rem', background: '#646cff', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 'bold', cursor: 'pointer' }}>⬅️ Volver</button>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          <img
            src={comic.image ? (comic.image.startsWith('http') ? comic.image : comic.image.startsWith('/') ? comic.image : '/' + comic.image) : ''}
            alt={comic.title}
            style={{ width: 320, borderRadius: 12, boxShadow: '0 2px 8px #0003' }}
          />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2em', marginBottom: '0.5em' }}>{comic.title}</h1>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5em' }}>Autor: {comic.author}</p>
            <p style={{ fontWeight: 'bold', color: '#646cff', fontSize: '1.3em', marginBottom: '1em' }}>${comic.price.toFixed(2)}</p>
            <p style={{ marginBottom: '1.5em' }}>{comic.description}</p>
            
            {/* Botón Agregar al carrito */}
            <button
              onClick={() => addToCart(comic)}
              disabled={buttonStates[comic.comic_id] === 'loading'}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: 'none',
                background: buttonStates[comic.comic_id] === 'success' 
                  ? 'linear-gradient(135deg, #00e676 0%, #00c853 100%)'
                  : buttonStates[comic.comic_id] === 'loading'
                  ? 'linear-gradient(135deg, #666 0%, #888 100%)'
                  : 'linear-gradient(135deg, #646cff 0%, #7c3aed 100%)',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                cursor: buttonStates[comic.comic_id] === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transform: buttonStates[comic.comic_id] === 'success' ? 'scale(1.02)' : 'scale(1)',
                boxShadow: buttonStates[comic.comic_id] === 'success' 
                  ? '0 6px 25px rgba(0, 230, 118, 0.4)' 
                  : '0 4px 16px rgba(100, 108, 255, 0.3)',
                marginBottom: '1.5rem'
              }}
              onMouseEnter={(e) => {
                if (buttonStates[comic.comic_id] !== 'loading') {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = buttonStates[comic.comic_id] === 'success' 
                    ? '0 8px 30px rgba(0, 230, 118, 0.5)' 
                    : '0 6px 25px rgba(100, 108, 255, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (buttonStates[comic.comic_id] !== 'loading') {
                  e.currentTarget.style.transform = buttonStates[comic.comic_id] === 'success' ? 'scale(1.02)' : 'scale(1)';
                  e.currentTarget.style.boxShadow = buttonStates[comic.comic_id] === 'success' 
                    ? '0 6px 25px rgba(0, 230, 118, 0.4)' 
                    : '0 4px 16px rgba(100, 108, 255, 0.3)';
                }
              }}
            >
              {buttonStates[comic.comic_id] === 'loading' && '⏳ Agregando...'}
              {buttonStates[comic.comic_id] === 'success' && '✅ ¡Agregado al carrito!'}
              {(!buttonStates[comic.comic_id] || buttonStates[comic.comic_id] === 'idle') && 'Agregar al carrito'}
            </button>
            
            <div style={{ marginTop: '1em', fontSize: '1.1em', color: '#bbb' }}>
              <p><span style={{ fontWeight: 'bold', color: '#fff' }}>Stock disponible:</span> {comic.stock_quantity ?? 'N/A'}</p>
              <p><span style={{ fontWeight: 'bold', color: '#fff' }}>Fecha de publicación:</span> {comic.publication_date ? new Date(comic.publication_date).toISOString().slice(0, 10) : 'N/A'}</p>
              <p><span style={{ fontWeight: 'bold', color: '#fff' }}>Género:</span> {comic.genre ?? 'N/A'}</p>
              <p><span style={{ fontWeight: 'bold', color: '#fff' }}>Publicador:</span> {comic.publisher ?? 'N/A'}</p>
              <p><span style={{ fontWeight: 'bold', color: '#fff' }}>Cantidad de reviews:</span> {comic.review_quantity ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Cuadro independiente para reseñas */}
      <div style={{ maxWidth: 900, margin: '2rem auto', background: '#23233a', borderRadius: 18, padding: '2rem', color: '#fff', boxShadow: '0 2px 16px #0007' }}>
        <h2 style={{ color: '#fff', marginBottom: '1em', textAlign: 'center' }}>Reseñas de usuarios</h2>
        {reviews.length === 0 ? (
          <p style={{ color: '#bbb', textAlign: 'center' }}>No hay reseñas para este cómic.</p>
        ) : (
          <>
            <div style={{
              maxHeight: '640px',
              overflowY: 'auto',
              paddingRight: '0.5em',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1.5em',
              marginBottom: '1.5em',
            }}>
              {paginatedReviews.map(review => (
                <div key={review.review_id} style={{
                  background: '#333',
                  borderRadius: 16,
                  padding: '1.2em',
                  boxShadow: '0 4px 16px #0005',
                  minHeight: 120,
                  marginBottom: '0.5em',
                  border: '1px solid #444',
                  transition: 'box-shadow 0.2s',
                }}>
                  <p style={{ fontWeight: 'bold', color: '#646cff', marginBottom: 4 }}>
                    Usuario: {review.user_name || review.user_id} <span style={{ color: '#ffd700' }}>★ {review.rating}</span>
                  </p>
                  <p style={{ margin: '0.5em 0', color: '#fff' }}>{review.review_text}</p>
                  <p style={{ fontSize: '0.9em', color: '#888', marginTop: 8 }}>{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            {/* Paginación */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1em', marginTop: '2em' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ background: '#646cff', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5em 1em', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
              >Anterior</button>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Página {page} de {Math.ceil(reviews.length / REVIEWS_PER_PAGE)}</span>
              <button
                onClick={() => setPage(p => p < Math.ceil(reviews.length / REVIEWS_PER_PAGE) ? p + 1 : p)}
                disabled={page >= Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
                style={{ background: '#646cff', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5em 1em', cursor: page >= Math.ceil(reviews.length / REVIEWS_PER_PAGE) ? 'not-allowed' : 'pointer', opacity: page >= Math.ceil(reviews.length / REVIEWS_PER_PAGE) ? 0.5 : 1 }}
              >Siguiente</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ComicDetail;
