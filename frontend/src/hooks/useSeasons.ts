import { useState, useEffect } from 'react';
import { fetchSeasons } from '../services/api';

export function useSeasons() {
  const [seasons, setSeasons] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchSeasons()
      .then(setSeasons)
      .catch((err) => setError(err.message || 'Failed to load seasons'))
      .finally(() => setLoading(false));
  }, []);

  return { seasons, loading, error };
}
