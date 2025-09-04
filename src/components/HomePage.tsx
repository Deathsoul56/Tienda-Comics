import React, { useEffect, useState, useMemo } from "react";
import type { Comic } from '../domain/entities';
import ComicDetail from "./ComicDetail";
import { container } from '../infrastructure/DependencyContainer';

// --- Barra de navegación ---
const NavBar: React.FC<{ onNav: (vista: string) => void; cartCount: number }> = ({ onNav, cartCount }) => (
  <nav style={{
    position: 'fixed', top: 0, left: -45, width: '100vw', zIndex: 100,
    background: 'rgba(36,36,44,0.92)',
    backdropFilter: 'blur(6px)',
    boxShadow: '0 2px 16px #0006',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.7rem 2.5vw',
    borderBottom: '1.5px solid #646cff44',
    margin: 0,
    right: 0,
    maxWidth: '100vw',
    minWidth: 0,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <img src="/logo.ico" alt="Logo" style={{ width: 44, height: 44, borderRadius: 12, marginRight: 12 }} />
      <span style={{ color: '#646cff', fontWeight: 'bold', fontSize: '1.5em', letterSpacing: '1.5px' }}>Hexagonal Comic Store</span>
    </div>
    <div style={{ display: 'flex', gap: 12 }}>
      <button className="btn-modern" onClick={() => onNav('home')}>🏠 Inicio</button>
      <button className="btn-modern" onClick={() => onNav('catalogo')}>📚 Catálogo</button>
      <button className="btn-modern" onClick={() => onNav('ventas')}>📈 Ventas</button>
      <button className="btn-modern" onClick={() => onNav('carrito')}>🛒 Carrito ({cartCount})</button>
    </div>
  </nav>
);

// --- Slider de imágenes ---
const HomeSlider: React.FC = () => {
  const slides = [
    '/home/slide_example_1.jpg',
    '/home/slide_example_2.jpg',
    '/home/slide_example_3.jpg',
    '/home/slide_example_4.jpg',
  ];
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % slides.length);
        setFade(false);
      }, 350);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);
  const goTo = (newIdx: number) => {
    setFade(true);
    setTimeout(() => {
      setIdx(newIdx);
      setFade(false);
    }, 350);
  };
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 900, margin: '2.5rem auto 2rem auto', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 32px #0008', background: '#181828' }}>
      <img
        src={slides[idx]}
        alt="slide"
        style={{
          width: '100%',
          height: 340,
          objectFit: 'cover',
          transition: 'opacity 0.35s',
          opacity: fade ? 0 : 1,
          position: 'relative',
          zIndex: 1,
        }}
      />
      <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8 }}>
        {slides.map((_, i) => (
          <span key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: idx === i ? '#646cff' : '#fff3', border: '2px solid #646cff', display: 'inline-block', transition: 'background 0.3s' }} />
        ))}
      </div>
      <button onClick={() => goTo(idx === 0 ? slides.length - 1 : idx - 1)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: '#23234a99', color: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 22, cursor: 'pointer', zIndex: 2 }}>&lt;</button>
      <button onClick={() => goTo((idx + 1) % slides.length)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: '#23234a99', color: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 22, cursor: 'pointer', zIndex: 2 }}>&gt;</button>
    </div>
  );
};

// --- Barra de búsqueda con autocompletado ---
const SearchBar: React.FC<{ comics: Comic[]; onSelect: (comic: Comic) => void }> = ({ comics, onSelect }) => {
  const [query, setQuery] = useState('');
  const [show, setShow] = useState(false);
  const filtered = useMemo(() =>
    query.length < 2 ? [] : comics.filter(c => c.title.toLowerCase().includes(query.toLowerCase())),
    [query, comics]
  );
  return (
    <div style={{ maxWidth: 500, margin: '2rem auto 2.5rem auto', position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        placeholder="Busca tu cómic favorito..."
        style={{ width: '100%', padding: '1em 1.2em', borderRadius: 12, border: '2px solid #646cff', fontSize: '1.1em', background: '#181828', color: '#fff', boxShadow: '0 2px 12px #0004', outline: 'none' }}
      />
      {show && filtered.length > 0 && (
        <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#23234a', borderRadius: 10, boxShadow: '0 2px 16px #0007', zIndex: 20, maxHeight: 260, overflowY: 'auto' }}>
          {filtered.slice(0, 8).map(c => (
            <div key={c.comic_id} style={{ padding: '0.7em 1em', cursor: 'pointer', color: '#fff', borderBottom: '1px solid #646cff22' }} onMouseDown={() => { onSelect(c); setQuery(''); }}>
              <span style={{ color: '#646cff', fontWeight: 'bold' }}>{c.title}</span> <span style={{ color: '#bbb', fontSize: '0.95em' }}>({c.author})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Sección de Últimos Agregados ---
const UltimosAgregados: React.FC<{ comics: Comic[]; onSelect: (comic: Comic) => void }> = ({ comics, onSelect }) => {
  const ultimos = useMemo(() =>
    [...comics].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6),
    [comics]
  );
  return (
    <section style={{ margin: '3rem auto 2.5rem auto', maxWidth: 1200 }}>
      <h2 style={{ color: '#fff', fontSize: '2em', marginBottom: '1.2em', textAlign: 'left', letterSpacing: '0.03em', fontWeight: 'bold' }}>Últimos agregados</h2>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {ultimos.map(comic => (
          <div key={comic.comic_id} style={{ background: '#23234a', borderRadius: 16, boxShadow: '0 2px 16px #0007', width: 180, padding: '1.2em', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s', border: '2px solid transparent' }}
            onClick={() => onSelect(comic)}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 24px #646cff99')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 16px #0007')}
          >
            <img src={comic.image} alt={comic.title} style={{ width: 120, height: 170, objectFit: 'cover', borderRadius: 8, marginBottom: 12, background: '#181828' }} />
            <div style={{ fontWeight: 'bold', color: '#646cff', fontSize: '1.1em', marginBottom: 4, textAlign: 'center' }}>{comic.title}</div>
            <div style={{ color: '#bbb', fontSize: '0.95em', marginBottom: 8, textAlign: 'center' }}>{comic.author}</div>
            <button className="btn-modern" style={{ width: '100%', marginTop: 6, fontSize: '0.95em' }}>Ver más</button>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Sección de Más Vendidos ---
const MasVendidos: React.FC<{ comics: Comic[]; onSelect: (comic: Comic) => void }> = ({ comics, onSelect }) => {
  const masVendidos = useMemo(() =>
    [...comics].sort((a, b) => (b.sold_quantity || 0) - (a.sold_quantity || 0)).slice(0, 6),
    [comics]
  );
  return (
    <section style={{ margin: '3rem auto 2.5rem auto', maxWidth: 1200 }}>
      <h2 style={{ color: '#fff', fontSize: '2em', marginBottom: '1.2em', textAlign: 'left', letterSpacing: '0.03em', fontWeight: 'bold' }}>Más vendidos</h2>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
        {masVendidos.map(comic => (
          <div key={comic.comic_id} style={{ background: '#23234a', borderRadius: 16, boxShadow: '0 2px 16px #0007', width: 180, padding: '1.2em', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s', border: '2px solid transparent' }}
            onClick={() => onSelect(comic)}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 24px #646cff99')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 16px #0007')}
          >
            <img src={comic.image} alt={comic.title} style={{ width: 120, height: 170, objectFit: 'cover', borderRadius: 8, marginBottom: 12, background: '#181828' }} />
            <div style={{ fontWeight: 'bold', color: '#646cff', fontSize: '1.1em', marginBottom: 4, textAlign: 'center' }}>{comic.title}</div>
            <div style={{ color: '#bbb', fontSize: '0.95em', marginBottom: 8, textAlign: 'center' }}>{comic.author}</div>
            <button className="btn-modern" style={{ width: '100%', marginTop: 6, fontSize: '0.95em' }}>Ver más</button>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Interface para reviews ---
interface Review {
  review_id: number;
  comic_id: number;
  user_id: string;
  user_name?: string;
  rating: number;
  review_text: string;
  created_at: string;
}

// --- Componente para mostrar reviews de un cómic ---
const ComicReviews: React.FC<{ comicId: number }> = ({ comicId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reviews/${comicId}`)
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : data.reviews || []))
      .finally(() => setLoading(false));
  }, [comicId]);
  if (loading) return <div style={{ color: '#bbb', margin: '1.5em 0' }}>Cargando reviews...</div>;
  return (
    <div style={{ marginTop: '2.5em' }}>
      <h2 style={{ color: '#fff', marginBottom: '1em', textAlign: 'center' }}>Reseñas de usuarios</h2>
      {reviews.length === 0 ? (
        <p style={{ color: '#bbb', textAlign: 'center' }}>No hay reseñas para este cómic.</p>
      ) : (
        <div style={{ maxHeight: 400, overflowY: 'auto', display: 'grid', gap: '1.2em', margin: '0 auto', padding: '0 1em' }}>
          {reviews.map(review => (
            <div key={review.review_id} style={{ background: '#333', borderRadius: 16, padding: '1.2em', boxShadow: '0 4px 16px #0005', minHeight: 100, border: '1px solid #444' }}>
              <p style={{ fontWeight: 'bold', color: '#646cff', marginBottom: 4 }}>
                Usuario: {review.user_name || review.user_id} <span style={{ color: '#ffd700' }}>★ {review.rating}</span>
              </p>
              <p style={{ margin: '0.5em 0', color: '#fff' }}>{review.review_text}</p>
              <p style={{ fontSize: '0.9em', color: '#888', marginTop: 8 }}>{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- HomePage principal ---
const HomePage: React.FC = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  useEffect(() => {
    const loadData = async () => {
      try {
        const comicsData = await container.getComicsUseCase.execute();
        setComics(comicsData);
        
        const cartSummary = await container.cartUseCase.getCartSummary();
        setCartCount(cartSummary.totalItems);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
    
    const updateCartCount = async () => {
      try {
        const cartSummary = await container.cartUseCase.getCartSummary();
        setCartCount(cartSummary.totalItems);
      } catch (error) {
        console.error('Error updating cart count:', error);
        setCartCount(0);
      }
    };
    
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  // Navegación
  const onNav = (vista: string) => {
    window.dispatchEvent(new CustomEvent('changeVista', { detail: vista }));
  };
  // Ir a detalles directo en Home
  const goToDetail = (comic: Comic) => {
    setSelectedComic(comic);
  };

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', paddingTop: 80 }}>
      <NavBar onNav={onNav} cartCount={cartCount} />
      <HomeSlider />
      <SearchBar comics={comics} onSelect={goToDetail} />
      {selectedComic ? (
        <ComicDetail comic={selectedComic} onBack={() => setSelectedComic(null)} />
      ) : (
        <>
          <UltimosAgregados comics={comics} onSelect={goToDetail} />
          <MasVendidos comics={comics} onSelect={goToDetail} />
        </>
      )}
    </div>
  );
};

export default HomePage;
