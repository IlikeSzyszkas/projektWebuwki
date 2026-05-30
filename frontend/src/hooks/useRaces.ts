import { useState, useEffect } from 'react';
import { fetchRaces } from '../services/api';
import type { Race } from '../types/f1';

export function useRaces(season: number | null) {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!season) return;
    setLoading(true);
    setError(null);
    fetchRaces(season)
      .then((data) => setRaces(data.races))
      .catch((err) => setError(err.message || 'Failed to load races'))
      .finally(() => setLoading(false));
  }, [season]);

  return { races, loading, error };
}
