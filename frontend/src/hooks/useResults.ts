import { useState, useEffect } from 'react';
import { fetchResults } from '../services/api';
import type { RaceResult, QualifyingResult } from '../types/f1';

export function useResults(season: number, round: number) {
  const [results, setResults] = useState<RaceResult[]>([]);
  const [qualifying, setQualifying] = useState<QualifyingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchResults(season, round)
      .then((data) => {
        setResults(data.results);
        setQualifying(data.qualifying);
      })
      .catch((err) => setError(err.message || 'Failed to load results'))
      .finally(() => setLoading(false));
  }, [season, round]);

  return { results, qualifying, loading, error };
}
