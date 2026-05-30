import { Link } from 'react-router-dom';
import type { Race } from '../types/f1';

interface Props {
  race: Race;
  winner?: string;
  winnerTeam?: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function isPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

export default function RaceCard({ race, winner, winnerTeam }: Props) {
  const past = isPast(race.date);

  return (
    <Link
      to={`/season/${race.season}/race/${race.round}`}
      className={`race-card${past ? '' : ' race-card--upcoming'}`}
      data-testid="race-card"
    >
      <div className="race-card__round">R{race.round}</div>
      <div className="race-card__body">
        <h3 className="race-card__name">{race.race_name}</h3>
        <p className="race-card__circuit">
          {race.circuit_name} &mdash; {race.locality}, {race.country}
        </p>
        <p className="race-card__date">{formatDate(race.date)}</p>
        {past && winner && (
          <p className="race-card__winner">
            Winner: <strong>{winner}</strong>
            {winnerTeam && <span className="race-card__team"> ({winnerTeam})</span>}
          </p>
        )}
        {!past && <span className="badge badge--upcoming">Upcoming</span>}
      </div>
    </Link>
  );
}
