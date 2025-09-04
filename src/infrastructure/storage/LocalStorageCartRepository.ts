import type { CartItem } from '../../domain/entities';
import type { CartRepository } from '../../domain/repositories';

export class LocalStorageCartRepository implements CartRepository {
  private storageKey = 'cart';

  async getItems(): Promise<CartItem[]> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const items = JSON.parse(stored);
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error('Failed to get cart items from localStorage:', error);
      return [];
    }
  }

  async saveItems(items: CartItem[]): Promise<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      this.dispatchStorageEvent();
    } catch (error) {
      throw new Error(`Failed to save cart items: ${error}`);
    }
  }

  async addItem(item: CartItem): Promise<void> {
    try {
      const currentItems = await this.getItems();
      const existingItemIndex = currentItems.findIndex(existing => existing.id === item.id);

      if (existingItemIndex >= 0) {
        currentItems[existingItemIndex].quantity += item.quantity;
      } else {
        currentItems.push(item);
      }

      await this.saveItems(currentItems);
    } catch (error) {
      throw new Error(`Failed to add item to cart: ${error}`);
    }
  }

  async removeItem(id: number): Promise<void> {
    try {
      const currentItems = await this.getItems();
      const filteredItems = currentItems.filter(item => item.id !== id);
      await this.saveItems(filteredItems);
    } catch (error) {
      throw new Error(`Failed to remove item from cart: ${error}`);
    }
  }

  async updateQuantity(id: number, quantity: number): Promise<void> {
    try {
      const currentItems = await this.getItems();
      const item = currentItems.find(item => item.id === id);

      if (item) {
        item.quantity = Math.max(1, quantity);
        await this.saveItems(currentItems);
      }
    } catch (error) {
      throw new Error(`Failed to update item quantity: ${error}`);
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
      this.dispatchStorageEvent();
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error}`);
    }
  }

  private dispatchStorageEvent(): void {
    // Dispatch storage event to notify other parts of the app
    window.dispatchEvent(new Event('storage'));
  }
}