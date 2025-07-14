import { useState, useEffect } from 'react'
import { useComicFilters } from './hooks/useComicFilters';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CatalogoComics from './components/CatalogoComics';
import type { Comic } from './components/CatalogoComics';

function App() {
  const [count, setCount] = useState(0);
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComics = (params = {}) => {
    setLoading(true);
    const query = new URLSearchParams(params).toString();
    fetch(`http://localhost:4000/comics${query ? `?${query}` : ''}`)
      .then((res) => res.json())
      .then((data) => {
        setComics(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo cargar el catálogo');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (mostrarCatalogo) {
      fetchComics();
    }
    // eslint-disable-next-line
  }, [mostrarCatalogo]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1>Tienda de Cómics</h1>
        <button
          onClick={() => setMostrarCatalogo(true)}
          style={{ margin: '1rem' }}
        >
          Ver Catálogo de Cómics
        </button>
        {loading && <p>Cargando cómics...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {mostrarCatalogo && !loading && !error && (
          <CatalogoComics comics={comics} onSearch={fetchComics} />
        )}
      </div>
    </>
  );
}

export default App
