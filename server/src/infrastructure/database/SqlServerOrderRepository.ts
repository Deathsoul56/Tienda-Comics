import sql from 'mssql';
import { Order, OrderStatus } from '../../domain/entities';
import { OrderRepository, MonthlySales } from '../../domain/repositories';

export class SqlServerOrderRepository implements OrderRepository {
  constructor(private dbConfig: sql.config) {}

  async findAll(): Promise<Order[]> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        SELECT o.order_id, u.user_name, o.user_id, o.order_date, o.total_amount, o.status, o.items
        FROM ${process.env.DB_DATABASE}.dbo.Orders o
        LEFT JOIN ${process.env.DB_DATABASE}.dbo.Users u ON o.user_id = u.user_id
        ORDER BY o.order_date DESC
      `);

      return result.recordset.map(this.mapOrderRecord);
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async findById(id: number): Promise<Order | null> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        SELECT o.order_id, u.user_name, o.user_id, o.order_date, o.total_amount, o.status, o.items
        FROM ${process.env.DB_DATABASE}.dbo.Orders o
        LEFT JOIN ${process.env.DB_DATABASE}.dbo.Users u ON o.user_id = u.user_id
        WHERE o.order_id = ${id}
      `);

      if (result.recordset.length === 0) {
        return null;
      }

      return this.mapOrderRecord(result.recordset[0]);
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async findByUserId(userId: number): Promise<Order[]> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        SELECT o.order_id, u.user_name, o.user_id, o.order_date, o.total_amount, o.status, o.items
        FROM ${process.env.DB_DATABASE}.dbo.Orders o
        LEFT JOIN ${process.env.DB_DATABASE}.dbo.Users u ON o.user_id = u.user_id
        WHERE o.user_id = ${userId}
        ORDER BY o.order_date DESC
      `);

      return result.recordset.map(this.mapOrderRecord);
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async create(orderData: Omit<Order, 'order_id'>): Promise<Order> {
    try {
      await sql.connect(this.dbConfig);
      
      const itemsJson = JSON.stringify(orderData.items);
      const result = await sql.query(`
        INSERT INTO Orders (user_id, order_date, total_amount, status, items)
        OUTPUT INSERTED.order_id, INSERTED.user_id, INSERTED.order_date, INSERTED.total_amount, INSERTED.status, INSERTED.items
        VALUES (${orderData.user_id}, '${orderData.order_date.toISOString()}', ${orderData.total_amount}, '${orderData.status}', '${itemsJson}')
      `);

      const insertedRecord = result.recordset[0];
      return {
        order_id: insertedRecord.order_id,
        user_id: insertedRecord.user_id,
        user_name: orderData.user_name,
        order_date: new Date(insertedRecord.order_date),
        total_amount: insertedRecord.total_amount,
        status: insertedRecord.status as OrderStatus,
        items: JSON.parse(insertedRecord.items)
      };
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async update(id: number, orderData: Partial<Order>): Promise<Order | null> {
    try {
      await sql.connect(this.dbConfig);
      
      const updateFields: string[] = [];
      
      if (orderData.total_amount !== undefined) {
        updateFields.push(`total_amount = ${orderData.total_amount}`);
      }
      
      if (orderData.status !== undefined) {
        updateFields.push(`status = '${orderData.status}'`);
      }
      
      if (orderData.items !== undefined) {
        const itemsJson = JSON.stringify(orderData.items);
        updateFields.push(`items = '${itemsJson}'`);
      }

      if (updateFields.length === 0) {
        return this.findById(id);
      }

      const result = await sql.query(`
        UPDATE Orders 
        SET ${updateFields.join(', ')}
        WHERE order_id = ${id}
      `);

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async updateStatus(id: number, status: OrderStatus): Promise<boolean> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        UPDATE Orders 
        SET status = '${status}'
        WHERE order_id = ${id}
      `);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`DELETE FROM Orders WHERE order_id = ${id}`);
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  async getMonthlySales(): Promise<MonthlySales[]> {
    try {
      await sql.connect(this.dbConfig);
      const result = await sql.query(`
        SELECT
          YEAR(order_date) AS Year,
          MONTH(order_date) AS Month,
          SUM(total_amount) AS TotalSales,
          COUNT(DISTINCT order_id) AS TotalOrders
        FROM Orders_Details
        GROUP BY YEAR(order_date), MONTH(order_date)
        ORDER BY Year, Month
      `);

      return result.recordset.map((record: any) => ({
        year: record.Year,
        month: record.Month,
        totalSales: record.TotalSales,
        totalOrders: record.TotalOrders
      }));
    } catch (error) {
      throw new Error(`Database error: ${error}`);
    }
  }

  private mapOrderRecord(record: any): Order {
    return {
      order_id: record.order_id,
      user_id: record.user_id,
      user_name: record.user_name || `User ${record.user_id}`,
      order_date: new Date(record.order_date),
      total_amount: record.total_amount,
      status: record.status as OrderStatus,
      items: typeof record.items === 'string' ? JSON.parse(record.items) : record.items
    };
  }
}