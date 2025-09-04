import type { CartItem, Comic } from '../../domain/entities';
import { CartEntity } from '../../domain/entities';
import type { CartRepository } from '../../domain/repositories';

export class CartUseCase {
  private cartRepository: CartRepository;

  constructor(cartRepository: CartRepository) {
    this.cartRepository = cartRepository;
  }

  async getCartItems(): Promise<CartItem[]> {
    try {
      return await this.cartRepository.getItems();
    } catch (error) {
      throw new Error(`Failed to get cart items: ${error}`);
    }
  }

  async addToCart(comic: Comic): Promise<void> {
    try {
      const currentItems = await this.cartRepository.getItems();
      const cart = new CartEntity(currentItems);
      
      cart.addItem({
        comic_id: comic.comic_id,
        title: comic.title,
        price: comic.price,
        image: comic.image
      });

      await this.cartRepository.saveItems(cart.getItems());
    } catch (error) {
      throw new Error(`Failed to add item to cart: ${error}`);
    }
  }

  async removeFromCart(id: number): Promise<void> {
    try {
      await this.cartRepository.removeItem(id);
    } catch (error) {
      throw new Error(`Failed to remove item from cart: ${error}`);
    }
  }

  async updateQuantity(id: number, quantity: number): Promise<void> {
    try {
      if (quantity <= 0) {
        await this.cartRepository.removeItem(id);
      } else {
        await this.cartRepository.updateQuantity(id, quantity);
      }
    } catch (error) {
      throw new Error(`Failed to update item quantity: ${error}`);
    }
  }

  async clearCart(): Promise<void> {
    try {
      await this.cartRepository.clear();
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error}`);
    }
  }

  async getCartSummary(): Promise<{ totalItems: number; totalAmount: number }> {
    try {
      const items = await this.cartRepository.getItems();
      const cart = new CartEntity(items);
      
      return {
        totalItems: cart.getTotalItems(),
        totalAmount: cart.getTotalAmount()
      };
    } catch (error) {
      throw new Error(`Failed to get cart summary: ${error}`);
    }
  }
}