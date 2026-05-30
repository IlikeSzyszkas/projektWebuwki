import { useNavigate } from 'react-router-dom';
import { useSeasons } from '../hooks/useSeasons';
import { useRaces } from '../hooks/useRaces';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CURRENT_SEASON = new Date().getFullYear();

export default function HomePage() {
  const navigate = useNavigate();
  const { seasons, loading: seasonsLoading, error: seasonsError } = useSeasons();
  const { races, loading: racesLoading } = useRaces(CURRENT_SEASON);

  const lastRace = races.filter((r) => new Date(r.date) < new Date()).at(-1);
  const nextRace = races.find((r) => new Date(r.date) >= new Date());

  if (seasonsLoading) return <LoadingSpinner message="Loading F1 data..." />;
  if (seasonsError) return <ErrorMessage message={seasonsError} />;

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            Formula 1 <span className="hero__accent">Results</span>
          </h1>
          <p className="hero__subtitle">
            Browse race results, qualifying, and standings from every F1 season.
          </p>
          <div className="hero__actions">
            <button className="btn btn--primary" onClick={() => navigate(`/season/${CURRENT_SEASON}`)}>
              {CURRENT_SEASON} Season
            </button>
            <button className="btn btn--outline" onClick={() => navigate(`/standings/${CURRENT_SEASON}`)}>
              Standings
            </button>
          </div>
        </div>
        <div className="hero__badge">
          <span className="hero__year">{CURRENT_SEASON}</span>
        </div>
      </section>

      {!racesLoading && (
        <section className="home-cards">
          {lastRace && (
            <div
              className="info-card info-card--clickable"
              onClick={() => navigate(`/season/${CURRENT_SEASON}/race/${lastRace.round}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/season/${CURRENT_SEASON}/race/${lastRace.round}`)}
            >
              <p className="info-card__label">Last Race</p>
              <h2 className="info-card__title">{lastRace.race_name}</h2>
              <p className="info-card__detail">
                Round {lastRace.round} &bull; {lastRace.country}
              </p>
              <p className="info-card__date">{new Date(lastRace.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <span className="btn btn--outline btn--sm">View Results</span>
            </div>
          )}

          {nextRace && (
            <div className="info-card info-card--upcoming">
              <p className="info-card__label">Next Race</p>
              <h2 className="info-card__title">{nextRace.race_name}</h2>
              <p className="info-card__detail">
                Round {nextRace.round} &bull; {nextRace.country}
              </p>
              <p className="info-card__date">{new Date(nextRace.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <span className="badge badge--upcoming">Upcoming</span>
            </div>
          )}

          <div
            className="info-card info-card--clickable"
            onClick={() => navigate(`/standings/${CURRENT_SEASON}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/standings/${CURRENT_SEASON}`)}
          >
            <p className="info-card__label">Championship</p>
            <h2 className="info-card__title">{CURRENT_SEASON} Standings</h2>
            <p className="info-card__detail">Driver &amp; Constructor championships</p>
            <span className="btn btn--outline btn--sm">View Standings</span>
          </div>
        </section>
      )}

      <section className="season-list">
        <h2 className="section-title">Browse by Season</h2>
        <div className="season-grid">
          {seasons.slice(0, 20).map((year) => (
            <button
              key={year}
              className={`season-btn${year === CURRENT_SEASON ? ' season-btn--current' : ''}`}
              onClick={() => navigate(`/season/${year}`)}
            >
              {year}
            </button>
          ))}
        </div>
        {seasons.length > 20 && (
          <button className="btn btn--outline" onClick={() => navigate('/season/1950')}>
            View all seasons →
          </button>
        )}
      </section>
    </main>
  );
}
