export interface Comic {
  comic_id: number;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  publication_date: Date;
  price: number;
  stock_quantity: number;
  sold_quantity: number;
  review_quantity: number;
  description: string;
  image: string;
  created_at: Date;
  updated_at: Date;
}

export class ComicEntity implements Comic {
  constructor(
    public comic_id: number,
    public title: string,
    public author: string,
    public publisher: string,
    public genre: string,
    public publication_date: Date,
    public price: number,
    public stock_quantity: number,
    public sold_quantity: number,
    public review_quantity: number,
    public description: string,
    public image: string,
    public created_at: Date,
    public updated_at: Date
  ) {}

  static create(data: Omit<Comic, 'comic_id' | 'created_at' | 'updated_at'>): ComicEntity {
    const now = new Date();
    return new ComicEntity(
      0, // Will be set by database
      data.title,
      data.author,
      data.publisher,
      data.genre,
      data.publication_date,
      data.price,
      data.stock_quantity,
      data.sold_quantity,
      data.review_quantity,
      data.description,
      data.image,
      now,
      now
    );
  }

  updateStock(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    this.stock_quantity = quantity;
    this.updated_at = new Date();
  }

  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Price must be greater than zero');
    }
    this.price = newPrice;
    this.updated_at = new Date();
  }

  isAvailable(): boolean {
    return this.stock_quantity > 0;
  }
}