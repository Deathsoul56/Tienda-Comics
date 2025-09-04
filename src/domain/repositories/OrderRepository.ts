import type { CartItem } from '../entities';

export interface CreateOrderRequest {
  userId?: number;
  userName?: string;
  items: CartItem[];
}

export interface OrderRepository {
  createOrder(request: CreateOrderRequest): Promise<void>;
}