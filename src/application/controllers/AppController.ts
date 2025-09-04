import { useState, useEffect } from 'react';
import type { Comic, CartItem } from '../../domain/entities';
import { container } from '../../infrastructure/DependencyContainer';
import { navigationService, type ViewType } from '../services/NavigationService';

export function useAppState() {
  const [vista, setVista] = useState<ViewType>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [comics, setComics] = useState<Comic[]>([]);
  const [selectedComicId, setSelectedComicId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData(setComics, setCart, setIsLoading, setError);
  }, []);

  // Subscribe to navigation changes
  useEffect(() => {
    const unsubscribe = navigationService.subscribe((newView) => {
      setVista(newView);
      setSelectedComicId(null);
    });

    // Handle legacy navigation events
    const handleLegacyNavigation = (e: CustomEvent) => {
      if (['home', 'catalogo', 'ventas', 'carrito'].includes(e.detail)) {
        setVista(e.detail);
        setSelectedComicId(null);
      }
    };

    window.addEventListener('changeVista', handleLegacyNavigation as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('changeVista', handleLegacyNavigation as EventListener);
    };
  }, []);

  // Listen for cart changes
  useEffect(() => {
    const handleStorageChange = () => {
      loadCartItems(setCart, setError);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const actions = {
    fetchComics: (params = {}) => fetchComics(params, setComics, setError),
    addToCart: (comic: Comic) => addToCart(comic, setCart, setError),
    removeFromCart: (id: number) => removeFromCart(id, setCart, setError),
    updateCartQuantity: (id: number, quantity: number) => 
      updateCartQuantity(id, quantity, setCart, setError),
    checkout: () => checkout(setCart, setError),
    setSelectedComicId,
    navigateTo: (view: ViewType) => navigationService.navigateTo(view)
  };

  const selectedComic = comics.find((c: Comic) => c.comic_id === selectedComicId) || null;

  return {
    state: {
      vista,
      cart,
      comics,
      selectedComicId,
      selectedComic,
      isLoading,
      error
    },
    actions
  };
}

async function loadInitialData(
  setComics: (comics: Comic[]) => void,
  setCart: (cart: CartItem[]) => void,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) {
  try {
    setIsLoading(true);
    setError(null);

    const [comicsData, cartItems] = await Promise.all([
      container.getComicsUseCase.execute(),
      container.cartUseCase.getCartItems()
    ]);

    setComics(comicsData);
    setCart(cartItems);
  } catch (error) {
    console.error('Error loading initial data:', error);
    setError('Error al cargar los datos iniciales');
  } finally {
    setIsLoading(false);
  }
}

async function loadCartItems(
  setCart: (cart: CartItem[]) => void,
  setError: (error: string | null) => void
) {
  try {
    const items = await container.cartUseCase.getCartItems();
    setCart(items);
  } catch (error) {
    console.error('Error loading cart:', error);
    setError('Error al cargar el carrito');
  }
}

async function fetchComics(
  params: Record<string, unknown>,
  setComics: (comics: Comic[]) => void,
  setError: (error: string | null) => void
) {
  try {
    setError(null);
    const comicsData = await container.getComicsUseCase.execute(params);
    setComics(comicsData);
  } catch (error) {
    console.error('Error loading comics:', error);
    setError('Error al cargar los cómics');
  }
}

async function addToCart(
  comic: Comic,
  setCart: (cart: CartItem[]) => void,
  setError: (error: string | null) => void
) {
  try {
    setError(null);
    await container.cartUseCase.addToCart(comic);
    const updatedCart = await container.cartUseCase.getCartItems();
    setCart(updatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    setError('Error al agregar al carrito');
  }
}

async function removeFromCart(
  id: number,
  setCart: (cart: CartItem[]) => void,
  setError: (error: string | null) => void
) {
  try {
    setError(null);
    await container.cartUseCase.removeFromCart(id);
    const updatedCart = await container.cartUseCase.getCartItems();
    setCart(updatedCart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    setError('Error al eliminar del carrito');
  }
}

async function updateCartQuantity(
  id: number,
  quantity: number,
  setCart: (cart: CartItem[]) => void,
  setError: (error: string | null) => void
) {
  try {
    setError(null);
    await container.cartUseCase.updateQuantity(id, quantity);
    const updatedCart = await container.cartUseCase.getCartItems();
    setCart(updatedCart);
  } catch (error) {
    console.error('Error updating quantity:', error);
    setError('Error al actualizar la cantidad');
  }
}

async function checkout(
  setCart: (cart: CartItem[]) => void,
  setError: (error: string | null) => void
) {
  try {
    setError(null);
    await container.checkoutUseCase.execute();
    setCart([]);
    alert('¡Compra realizada!');
  } catch (error) {
    console.error('Error during checkout:', error);
    setError('Error al procesar la compra');
    alert('Error al procesar la compra');
  }
}