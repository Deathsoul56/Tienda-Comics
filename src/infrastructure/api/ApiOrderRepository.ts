import type { OrderRepository, CreateOrderRequest } from '../../domain/repositories';

export class ApiOrderRepository implements OrderRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  }

  async createOrder(request: CreateOrderRequest): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: request.userId || 1,
          userName: request.userName || 'Guest User',
          items: request.items.map(item => ({
            comic_id: item.comic_id || item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to create order: ${error}`);
    }
  }
}