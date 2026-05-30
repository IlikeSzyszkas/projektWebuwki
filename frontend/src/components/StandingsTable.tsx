import type { DriverStanding, ConstructorStanding } from '../types/f1';

interface DriverProps {
  standings: DriverStanding[];
}

interface ConstructorProps {
  standings: ConstructorStanding[];
}

function positionClass(pos: number): string {
  if (pos === 1) return 'pos pos--gold';
  if (pos === 2) return 'pos pos--silver';
  if (pos === 3) return 'pos pos--bronze';
  return 'pos';
}

function PointsBar({ points, max }: { points: number; max: number }) {
  const pct = max > 0 ? (points / max) * 100 : 0;
  return (
    <div className="points-bar-wrapper">
      <div className="points-bar" style={{ width: `${pct}%` }} />
      <span className="points-bar-label">{points}</span>
    </div>
  );
}

export function DriverStandingsTable({ standings }: DriverProps) {
  if (standings.length === 0) {
    return <p className="empty-state">No standings available yet.</p>;
  }
  const maxPoints = standings[0]?.points ?? 1;

  return (
    <div className="table-wrapper">
      <table className="results-table" data-testid="driver-standings-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Driver</th>
            <th className="hide-mobile">Nat.</th>
            <th className="hide-mobile">Wins</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s) => (
            <tr key={s.driver_id}>
              <td>
                <span className={positionClass(s.position)}>{s.position}</span>
              </td>
              <td>
                <span className="driver-code hide-mobile">{s.code ?? ''}</span>
                <span className="driver-name">
                  {s.forename} <strong>{s.surname}</strong>
                </span>
              </td>
              <td className="hide-mobile">{s.nationality ?? '—'}</td>
              <td className="hide-mobile">{s.wins}</td>
              <td>
                <PointsBar points={s.points} max={maxPoints} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ConstructorStandingsTable({ standings }: ConstructorProps) {
  if (standings.length === 0) {
    return <p className="empty-state">No standings available yet.</p>;
  }
  const maxPoints = standings[0]?.points ?? 1;

  return (
    <div className="table-wrapper">
      <table className="results-table" data-testid="constructor-standings-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Constructor</th>
            <th className="hide-mobile">Nat.</th>
            <th className="hide-mobile">Wins</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s) => (
            <tr key={s.constructor_id}>
              <td>
                <span className={positionClass(s.position)}>{s.position}</span>
              </td>
              <td>
                <strong>{s.constructor_name}</strong>
              </td>
              <td className="hide-mobile">{s.nationality ?? '—'}</td>
              <td className="hide-mobile">{s.wins}</td>
              <td>
                <PointsBar points={s.points} max={maxPoints} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
