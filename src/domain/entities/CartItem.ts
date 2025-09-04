export interface CartItem {
  id: number;
  comic_id?: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export class CartEntity {
  private items: CartItem[];

  constructor(items: CartItem[] = []) {
    this.items = items;
  }

  addItem(comic: { comic_id: number; title: string; price: number; image: string }): void {
    const existingItem = this.items.find(item => item.id === comic.comic_id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        id: comic.comic_id,
        comic_id: comic.comic_id,
        title: comic.title,
        price: comic.price,
        image: comic.image,
        quantity: 1
      });
    }
  }

  removeItem(id: number): void {
    this.items = this.items.filter(item => item.id !== id);
  }

  updateQuantity(id: number, quantity: number): void {
    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getTotalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalAmount(): number {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  clear(): void {
    this.items = [];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}