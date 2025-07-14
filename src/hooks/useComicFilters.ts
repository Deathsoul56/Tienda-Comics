import { useEffect, useState } from 'react';

export function useComicFilters() {
  const [authors, setAuthors] = useState<string[]>([]);
  const [publishers, setPublishers] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    fetch(`${apiUrl}/comics/filters`)
      .then(res => res.json())
      .then(data => {
        setAuthors(data.authors || []);
        setPublishers(data.publishers || []);
        setGenres(data.genres || []);
      });
  }, []);

  return { authors, publishers, genres };
}
