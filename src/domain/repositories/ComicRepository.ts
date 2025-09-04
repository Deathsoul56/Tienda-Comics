import type { Comic, ComicFilters, ComicFilterOptions } from '../entities';

export interface ComicRepository {
  findAll(filters?: ComicFilters): Promise<Comic[]>;
  findById(id: number): Promise<Comic | null>;
  getFilterOptions(): Promise<ComicFilterOptions>;
}