import { Order, OrderStatus } from '../entities';

export interface MonthlySales {
  year: number;
  month: number;
  totalSales: number;
  totalOrders: number;
}

export interface OrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: number): Promise<Order | null>;
  findByUserId(userId: number): Promise<Order[]>;
  create(order: Omit<Order, 'order_id'>): Promise<Order>;
  update(id: number, order: Partial<Order>): Promise<Order | null>;
  updateStatus(id: number, status: OrderStatus): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  getMonthlySales(): Promise<MonthlySales[]>;
}