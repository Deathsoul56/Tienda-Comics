import { Comic } from '../entities';

export interface ComicFilters {
  author?: string;
  publisher?: string;
  genre?: string;
  priceRange?: string;
  order?: 'title_asc' | 'title_desc' | 'price_asc' | 'price_desc' | 'position';
}

export interface ComicFilterOptions {
  authors: string[];
  publishers: string[];
  genres: string[];
}

export interface ComicRepository {
  findAll(filters?: ComicFilters): Promise<Comic[]>;
  findById(id: number): Promise<Comic | null>;
  findByIds(ids: number[]): Promise<Comic[]>;
  create(comic: Omit<Comic, 'comic_id' | 'created_at' | 'updated_at'>): Promise<Comic>;
  update(id: number, comic: Partial<Comic>): Promise<Comic | null>;
  delete(id: number): Promise<boolean>;
  getFilterOptions(): Promise<ComicFilterOptions>;
  updateStock(id: number, quantity: number): Promise<boolean>;
  incrementSoldQuantity(id: number, quantity: number): Promise<boolean>;
}