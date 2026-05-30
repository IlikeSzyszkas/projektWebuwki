import { useState, useEffect } from 'react';
import { fetchDriverStandings, fetchConstructorStandings } from '../services/api';
import type { DriverStanding, ConstructorStanding } from '../types/f1';

export function useDriverStandings(season: number | null) {
  const [standings, setStandings] = useState<DriverStanding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!season) return;
    setLoading(true);
    setError(null);
    fetchDriverStandings(season)
      .then((data) => setStandings(data.standings))
      .catch((err) => setError(err.message || 'Failed to load driver standings'))
      .finally(() => setLoading(false));
  }, [season]);

  return { standings, loading, error };
}

export function useConstructorStandings(season: number | null) {
  const [standings, setStandings] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!season) return;
    setLoading(true);
    setError(null);
    fetchConstructorStandings(season)
      .then((data) => setStandings(data.standings))
      .catch((err) => setError(err.message || 'Failed to load constructor standings'))
      .finally(() => setLoading(false));
  }, [season]);

  return { standings, loading, error };
}
