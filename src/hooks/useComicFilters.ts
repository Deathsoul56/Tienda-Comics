import { useEffect, useState } from 'react';
import type { ComicFilterOptions } from '../domain/entities';
import { container } from '../infrastructure/DependencyContainer';

export function useComicFilters() {
  const [authors, setAuthors] = useState<string[]>([]);
  const [publishers, setPublishers] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const filters: ComicFilterOptions = await container.getComicFiltersUseCase.execute();
        setAuthors(filters.authors || []);
        setPublishers(filters.publishers || []);
        setGenres(filters.genres || []);
      } catch (error) {
        console.error('Error loading comic filters:', error);
      }
    };
    
    loadFilters();
  }, []);

  return { authors, publishers, genres };
}
