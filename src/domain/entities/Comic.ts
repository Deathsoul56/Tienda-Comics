export interface Comic {
  comic_id: number;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  publication_date: string;
  price: number;
  stock_quantity: number;
  sold_quantity: number;
  review_quantity: number;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

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