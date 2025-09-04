import { Request, Response } from 'express';
import { CreateOrderUseCase, GetSalesUseCase } from '../../application/usecases';

export class OrderController {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private getSalesUseCase: GetSalesUseCase
  ) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { userId = 1, userName = 'Guest User', items } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Items are required and must be a non-empty array' });
        return;
      }

      const order = await this.createOrderUseCase.execute({
        userId,
        userName,
        items
      });

      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      
      if (error instanceof Error && error.message.includes('Insufficient stock')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to create order' });
      }
    }
  }

  async getSales(req: Request, res: Response): Promise<void> {
    try {
      const sales = await this.getSalesUseCase.getAllSales();
      res.json(sales);
    } catch (error) {
      console.error('Error getting sales:', error);
      res.status(500).json({ error: 'Failed to get sales' });
    }
  }

  async getMonthlySales(req: Request, res: Response): Promise<void> {
    try {
      const monthlySales = await this.getSalesUseCase.getMonthlySales();
      res.json(monthlySales);
    } catch (error) {
      console.error('Error getting monthly sales:', error);
      res.status(500).json({ error: 'Failed to get monthly sales' });
    }
  }
}