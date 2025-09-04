import type { Comic, ComicFilters, ComicFilterOptions } from '../../domain/entities';
import type { ComicRepository } from '../../domain/repositories';

export class ApiComicRepository implements ComicRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  }

  async findAll(filters?: ComicFilters): Promise<Comic[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.author) params.append('author', filters.author);
      if (filters?.publisher) params.append('publisher', filters.publisher);
      if (filters?.genre) params.append('genre', filters.genre);
      if (filters?.priceRange) params.append('priceRange', filters.priceRange);
      if (filters?.order) params.append('order', filters.order);

      const queryString = params.toString();
      const url = `${this.baseUrl}/comics${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch comics: ${error}`);
    }
  }

  async findById(id: number): Promise<Comic | null> {
    try {
      const response = await fetch(`${this.baseUrl}/comics/${id}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch comic: ${error}`);
    }
  }

  async getFilterOptions(): Promise<ComicFilterOptions> {
    try {
      const response = await fetch(`${this.baseUrl}/comics/filters`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch filter options: ${error}`);
    }
  }
}