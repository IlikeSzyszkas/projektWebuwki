import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useResults } from '../hooks/useResults';
import { useRaces } from '../hooks/useRaces';
import ResultsTable from '../components/ResultsTable';
import QualifyingTable from '../components/QualifyingTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

type Tab = 'race' | 'qualifying';

export default function RacePage() {
  const { year, round } = useParams<{ year: string; round: string }>();
  const season = parseInt(year ?? '0');
  const roundNum = parseInt(round ?? '0');
  const [tab, setTab] = useState<Tab>('race');

  const { results, qualifying, loading, error } = useResults(season, roundNum);
  const { races } = useRaces(season);

  const race = races.find((r) => r.round === roundNum);
  const prevRound = roundNum > 1 ? roundNum - 1 : null;
  const nextRound = races.find((r) => r.round === roundNum + 1) ? roundNum + 1 : null;

  if (loading) return <LoadingSpinner message="Loading race data..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="race-page">
      <div className="race-header">
        <div className="race-header__nav">
          {prevRound && (
            <Link to={`/season/${season}/race/${prevRound}`} className="btn btn--ghost btn--sm">
              ← Prev
            </Link>
          )}
          <Link to={`/season/${season}`} className="btn btn--ghost btn--sm">
            {season} Calendar
          </Link>
          {nextRound && (
            <Link to={`/season/${season}/race/${nextRound}`} className="btn btn--ghost btn--sm">
              Next →
            </Link>
          )}
        </div>

        {race && (
          <div className="race-header__info">
            <div className="race-header__round">Round {race.round}</div>
            <h1 className="race-header__name">{race.race_name}</h1>
            <p className="race-header__circuit">
              {race.circuit_name} &mdash; {race.locality}, {race.country}
            </p>
            <p className="race-header__date">
              {new Date(race.date).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>

      <div className="tabs">
        <button
          className={`tab${tab === 'race' ? ' tab--active' : ''}`}
          onClick={() => setTab('race')}
        >
          Race Results
        </button>
        <button
          className={`tab${tab === 'qualifying' ? ' tab--active' : ''}`}
          onClick={() => setTab('qualifying')}
        >
          Qualifying
        </button>
      </div>

      {tab === 'race' && <ResultsTable results={results} />}
      {tab === 'qualifying' && <QualifyingTable results={qualifying} />}
    </main>
  );
}
