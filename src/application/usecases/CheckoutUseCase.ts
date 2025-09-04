import type { CartRepository, OrderRepository, CreateOrderRequest } from '../../domain/repositories';

export class CheckoutUseCase {
  private cartRepository: CartRepository;
  private orderRepository: OrderRepository;

  constructor(
    cartRepository: CartRepository,
    orderRepository: OrderRepository
  ) {
    this.cartRepository = cartRepository;
    this.orderRepository = orderRepository;
  }

  async execute(userId: number = 1, userName: string = 'Guest User'): Promise<void> {
    try {
      const items = await this.cartRepository.getItems();

      if (items.length === 0) {
        throw new Error('Cart is empty');
      }

      const orderRequest: CreateOrderRequest = {
        userId,
        userName,
        items: items.map(item => ({
          id: item.comic_id || item.id,
          comic_id: item.comic_id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity
        }))
      };

      await this.orderRepository.createOrder(orderRequest);
      await this.cartRepository.clear();
    } catch (error) {
      throw new Error(`Failed to checkout: ${error}`);
    }
  }
}