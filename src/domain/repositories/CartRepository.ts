import type { CartItem } from '../entities';

export interface CartRepository {
  getItems(): Promise<CartItem[]>;
  saveItems(items: CartItem[]): Promise<void>;
  addItem(item: CartItem): Promise<void>;
  removeItem(id: number): Promise<void>;
  updateQuantity(id: number, quantity: number): Promise<void>;
  clear(): Promise<void>;
}