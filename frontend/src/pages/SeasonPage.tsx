import { useParams, Link } from 'react-router-dom';
import { useRaces } from '../hooks/useRaces';
import RaceCard from '../components/RaceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function SeasonPage() {
  const { year } = useParams<{ year: string }>();
  const season = parseInt(year ?? '0');
  const { races, loading, error } = useRaces(season);

  if (loading) return <LoadingSpinner message={`Loading ${season} season...`} />;
  if (error) return <ErrorMessage message={error} />;

  const past = races.filter((r) => new Date(r.date) < new Date());
  const upcoming = races.filter((r) => new Date(r.date) >= new Date());

  return (
    <main className="season-page">
      <div className="page-header">
        <h1 className="page-title">{season} Formula 1 Season</h1>
        <div className="page-header__actions">
          <Link to={`/standings/${season}`} className="btn btn--outline">
            {season} Standings
          </Link>
        </div>
      </div>

      <div className="season-stats">
        <div className="stat-chip">
          <span className="stat-chip__value">{races.length}</span>
          <span className="stat-chip__label">Races</span>
        </div>
        <div className="stat-chip">
          <span className="stat-chip__value">{past.length}</span>
          <span className="stat-chip__label">Completed</span>
        </div>
        {upcoming.length > 0 && (
          <div className="stat-chip">
            <span className="stat-chip__value">{upcoming.length}</span>
            <span className="stat-chip__label">Remaining</span>
          </div>
        )}
      </div>

      {races.length === 0 && <p className="empty-state">No races found for this season.</p>}

      {past.length > 0 && (
        <section>
          <h2 className="section-title">Completed Races</h2>
          <div className="race-grid">
            {past.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="section-title">Upcoming Races</h2>
          <div className="race-grid">
            {upcoming.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
