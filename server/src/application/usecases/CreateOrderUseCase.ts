import { Order, OrderEntity, OrderItem } from '../../domain/entities';
import { OrderRepository, ComicRepository } from '../../domain/repositories';

export interface CreateOrderRequest {
  userId: number;
  userName: string;
  items: OrderItem[];
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private comicRepository: ComicRepository
  ) {}

  async execute(request: CreateOrderRequest): Promise<Order> {
    try {
      // Validate items and check stock
      await this.validateOrderItems(request.items);

      // Create order entity
      const orderEntity = OrderEntity.create(
        request.userId,
        request.userName,
        request.items
      );

      // Create order in database
      const createdOrder = await this.orderRepository.create({
        user_id: orderEntity.user_id,
        user_name: orderEntity.user_name,
        order_date: orderEntity.order_date,
        total_amount: orderEntity.total_amount,
        status: orderEntity.status,
        items: orderEntity.items
      });

      // Update comic stock and sold quantities
      await this.updateComicQuantities(request.items);

      return createdOrder;
    } catch (error) {
      throw new Error(`Failed to create order: ${error}`);
    }
  }

  private async validateOrderItems(items: OrderItem[]): Promise<void> {
    if (!items || items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    const comicIds = items.map(item => item.comic_id);
    const comics = await this.comicRepository.findByIds(comicIds);

    for (const item of items) {
      const comic = comics.find(c => c.comic_id === item.comic_id);
      
      if (!comic) {
        throw new Error(`Comic with ID ${item.comic_id} not found`);
      }

      if (comic.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for comic: ${comic.title}. Available: ${comic.stock_quantity}, Requested: ${item.quantity}`);
      }

      if (item.quantity <= 0) {
        throw new Error('Item quantity must be greater than zero');
      }
    }
  }

  private async updateComicQuantities(items: OrderItem[]): Promise<void> {
    for (const item of items) {
      // Reduce stock quantity
      await this.comicRepository.updateStock(
        item.comic_id,
        -item.quantity // Negative to reduce stock
      );

      // Increase sold quantity
      await this.comicRepository.incrementSoldQuantity(
        item.comic_id,
        item.quantity
      );
    }
  }
}