import './App.css'
import CatalogoComics from './components/CatalogoComics';
import ComicDetail from './components/ComicDetail';
import HomePage from './components/HomePage';
import VentasTienda from './components/VentasTienda';
import Carrito from './components/Carrito';
import UserProfile from './components/UserProfile';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { ErrorBoundary, Button, LoadingSpinner } from './components/common';
import { useAppState } from './application/controllers/AppController';


function App() {
  const { state, actions } = useAppState();
  const { vista, cart, comics, selectedComic, selectedComicId, isLoading, error, user } = state;
  const {
    fetchComics,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    checkout,
    setSelectedComicId,
    navigateTo,
    logout
  } = actions;
  if (isLoading) {
    return <LoadingSpinner size="large" text="Cargando aplicación..." />;
  }

  return (
    <ErrorBoundary>
      {error && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          backgroundColor: '#ff6b6b',
          color: 'white',
          padding: '1rem',
          borderRadius: '6px',
          zIndex: 1000,
          maxWidth: '300px'
        }}>
          {error}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginLeft: '1rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
      )}
      {vista !== 'home' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Button onClick={() => navigateTo('home')}>🏠 Inicio</Button>
          <Button onClick={() => navigateTo('catalogo')}>📚 Catálogo</Button>
          <Button onClick={() => navigateTo('ventas')}>📈 Ventas</Button>
          <Button onClick={() => navigateTo('carrito')}>
            🛒 Carrito ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </Button>
          {user ? (
            <>
              <Button onClick={() => navigateTo('perfil')}>👤 Mi Perfil</Button>
              <Button onClick={logout}>🚪 Salir</Button>
            </>
          ) : (
            <Button onClick={() => navigateTo('login')}>👤 Ingresar</Button>
          )}
        </div>
      )}
      {vista === 'catalogo' && selectedComicId === null && (
        <CatalogoComics
          comics={comics}
          onSearch={fetchComics}
          onAddToCart={addToCart}
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
      {vista === 'home' && <HomePage user={user} onLogout={logout} />}
      {vista === 'carrito' && (
        <Carrito
          items={cart}
          onRemove={removeFromCart}
          onChangeQuantity={updateCartQuantity}
          onCheckout={checkout}
        />
      )}
      {vista === 'ventas' && <VentasTienda />}
      {vista === 'login' && <Login onLogin={actions.login} />}
      {vista === 'register' && <Register onLogin={actions.login} />}
      {vista === 'perfil' && user && <UserProfile user={user} onLogout={logout} />}
    </ErrorBoundary>
  );
}

export default App
