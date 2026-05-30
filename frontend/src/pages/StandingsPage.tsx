import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDriverStandings, useConstructorStandings } from '../hooks/useStandings';
import { useSeasons } from '../hooks/useSeasons';
import { DriverStandingsTable, ConstructorStandingsTable } from '../components/StandingsTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

type Tab = 'drivers' | 'constructors';

export default function StandingsPage() {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const season = parseInt(year ?? '0');
  const [tab, setTab] = useState<Tab>('drivers');

  const { seasons } = useSeasons();
  const { standings: driverStandings, loading: dLoading, error: dError } = useDriverStandings(season);
  const { standings: constructorStandings, loading: cLoading, error: cError } = useConstructorStandings(season);

  const loading = dLoading || cLoading;
  const error = dError || cError;

  return (
    <main className="standings-page">
      <div className="page-header">
        <h1 className="page-title">{season} Championship Standings</h1>
        <select
          className="season-select"
          value={season}
          onChange={(e) => navigate(`/standings/${e.target.value}`)}
        >
          {seasons.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="tabs">
        <button
          className={`tab${tab === 'drivers' ? ' tab--active' : ''}`}
          onClick={() => setTab('drivers')}
        >
          Drivers
        </button>
        <button
          className={`tab${tab === 'constructors' ? ' tab--active' : ''}`}
          onClick={() => setTab('constructors')}
        >
          Constructors
        </button>
      </div>

      {loading && <LoadingSpinner message="Loading standings..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && tab === 'drivers' && (
        <DriverStandingsTable standings={driverStandings} />
      )}
      {!loading && !error && tab === 'constructors' && (
        <ConstructorStandingsTable standings={constructorStandings} />
      )}
    </main>
  );
}
