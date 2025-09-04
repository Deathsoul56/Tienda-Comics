export interface OrderItem {
  comic_id: number;
  quantity: number;
  price: number;
}

export interface Order {
  order_id: number;
  user_id: number;
  user_name: string;
  order_date: Date;
  total_amount: number;
  status: OrderStatus;
  items: OrderItem[];
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export class OrderEntity implements Order {
  constructor(
    public order_id: number,
    public user_id: number,
    public user_name: string,
    public order_date: Date,
    public total_amount: number,
    public status: OrderStatus,
    public items: OrderItem[]
  ) {}

  static create(userId: number, userName: string, items: OrderItem[]): OrderEntity {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return new OrderEntity(
      0, // Will be set by database
      userId,
      userName,
      new Date(),
      total,
      OrderStatus.PENDING,
      items
    );
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  updateStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
  }

  addItem(item: OrderItem): void {
    this.items.push(item);
    this.total_amount = this.calculateTotal();
  }

  removeItem(comicId: number): void {
    this.items = this.items.filter(item => item.comic_id !== comicId);
    this.total_amount = this.calculateTotal();
  }

  getTotalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}