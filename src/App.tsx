import { useState, useEffect } from 'react'
import './App.css'
import CatalogoComics from './components/CatalogoComics';
import type { Comic } from './components/CatalogoComics';
import ComicDetail from './components/ComicDetail';
import HomePage from './components/HomePage';
import VentasTienda from './components/VentasTienda';
import Carrito from './components/Carrito';
import type { CartItem } from './components/Carrito';
// import type { Comic } from './components/CatalogoComics'; // Duplicado, eliminar

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function App() {
  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail === 'catalogo' || e.detail === 'ventas') setVista(e.detail);
    };
    window.addEventListener('changeVista', handler);
    return () => window.removeEventListener('changeVista', handler);
  }, []);
  // const [count, setCount] = useState(0); // Removed unused variable
  const [vista, setVista] = useState<'home' | 'catalogo' | 'ventas' | 'carrito'>('home');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  const [comics, setComics] = useState<Comic[]>([]);

  const fetchComics = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    fetch(`${API_BASE_URL}/comics${query ? `?${query}` : ''}`)
      .then((res) => res.json())
      .then((data) => {
        setComics(data);
      })
      .catch(() => {
        // Error al cargar el catálogo
      });
  };

  useEffect(() => {
    fetchComics(); // Mostrar todo el catálogo por defecto
  }, []);

  const [selectedComicId, setSelectedComicId] = useState<number | null>(null);
  const selectedComic = comics.find((c: Comic) => c.comic_id === selectedComicId) || null;
  return (
    <>
      {vista !== 'home' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button className="btn-modern" onClick={() => { setVista('home'); setSelectedComicId(null); }}>Inicio</button>
          <button className="btn-modern" onClick={() => { setVista('catalogo'); setSelectedComicId(null); }}>Catálogo</button>
          <button className="btn-modern" onClick={() => { setVista('ventas'); setSelectedComicId(null); }}>Ventas</button>
          <button className="btn-modern" onClick={() => { setVista('carrito'); setSelectedComicId(null); }}>Carrito ({cart.reduce((sum, item) => sum + item.quantity, 0)})</button>
        </div>
      )}
      {vista === 'catalogo' && selectedComicId === null && (
        <CatalogoComics
          comics={comics}
          onSearch={fetchComics}
          onAddToCart={(comic: Comic) => {
            setCart(prev => {
              const found = prev.find(item => item.id === comic.comic_id);
              if (found) {
                return prev.map(item => item.id === comic.comic_id ? { ...item, quantity: item.quantity + 1 } : item);
              }
              return [...prev, { id: comic.comic_id, title: comic.title, price: comic.price, image: comic.image, quantity: 1 }];
            });
          }}
          onComicClick={comic => setSelectedComicId(comic.comic_id)}
        />
      )}
      {vista === 'catalogo' && selectedComicId !== null && (
        selectedComic ? (
          <ComicDetail comic={selectedComic} onBack={() => setSelectedComicId(null)} />
        ) : (
          <div style={{ color: '#fff', padding: '2rem', textAlign: 'center' }}>Cómic no encontrado.</div>
        )
      )}
      {vista === 'home' && <HomePage />}
      {vista === 'carrito' && <Carrito
        items={cart}
        onRemove={(id) => setCart(cart => cart.filter(item => item.id !== id))}
        onChangeQuantity={(id, newQuantity) => setCart(cart => cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item))}
        onCheckout={async () => {
          try {
            await fetch(`${API_BASE_URL}/orders`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: cart })
            });
          } catch (e) {
            alert('Error al enviar la orden');
            return;
          }
          setCart([]);
          localStorage.removeItem('cart');
          alert('¡Compra realizada!');
        }}
      />}
      {vista === 'ventas' && <VentasTienda />}
    </>
  );
}

export default App
