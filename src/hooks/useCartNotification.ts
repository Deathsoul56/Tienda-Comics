import { useState } from 'react';
import type { Comic } from '../domain/entities';
import { container } from '../infrastructure/DependencyContainer';

export const useCartNotification = () => {
  const [notification, setNotification] = useState<{show: boolean, comic: Comic | null}>({show: false, comic: null});
  const [buttonStates, setButtonStates] = useState<Record<number, 'idle' | 'loading' | 'success'>>({});

  const addToCart = async (comic: Comic) => {
    try {
      // Cambiar estado del botón a loading
      setButtonStates(prev => ({...prev, [comic.comic_id]: 'loading'}));
      
      await container.cartUseCase.addToCart(comic);
      
      // Cambiar estado del botón a success
      setButtonStates(prev => ({...prev, [comic.comic_id]: 'success'}));
      
      // Mostrar notificación
      setNotification({show: true, comic});
      
      // Resetear estados después de las animaciones
      setTimeout(() => {
        setButtonStates(prev => ({...prev, [comic.comic_id]: 'idle'}));
      }, 2000);
      
      setTimeout(() => {
        setNotification({show: false, comic: null});
      }, 3000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setButtonStates(prev => ({...prev, [comic.comic_id]: 'idle'}));
    }
  };

  return {
    notification,
    buttonStates,
    addToCart
  };
};