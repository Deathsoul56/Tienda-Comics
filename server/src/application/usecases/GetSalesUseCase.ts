import { Order } from '../../domain/entities';
import { OrderRepository, MonthlySales } from '../../domain/repositories';

export class GetSalesUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async getAllSales(): Promise<Order[]> {
    try {
      return await this.orderRepository.findAll();
    } catch (error) {
      throw new Error(`Failed to get sales: ${error}`);
    }
  }

  async getMonthlySales(): Promise<MonthlySales[]> {
    try {
      return await this.orderRepository.getMonthlySales();
    } catch (error) {
      throw new Error(`Failed to get monthly sales: ${error}`);
    }
  }
}