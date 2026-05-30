import type { RaceResult } from '../types/f1';

interface Props {
  results: RaceResult[];
}

function positionClass(pos: number | null): string {
  if (pos === 1) return 'pos pos--gold';
  if (pos === 2) return 'pos pos--silver';
  if (pos === 3) return 'pos pos--bronze';
  return 'pos';
}

export default function ResultsTable({ results }: Props) {
  if (results.length === 0) {
    return <p className="empty-state">No race results available yet.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="results-table" data-testid="results-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>No.</th>
            <th>Driver</th>
            <th className="hide-mobile">Team</th>
            <th className="hide-mobile">Grid</th>
            <th className="hide-mobile">Laps</th>
            <th>Time / Status</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.driver_id} className={r.fastest_lap_rank === 1 ? 'row--fastest-lap' : ''}>
              <td>
                <span className={positionClass(r.position)}>{r.position_text}</span>
              </td>
              <td className="driver-number">{r.permanent_number ?? r.code ?? '—'}</td>
              <td>
                <span className="driver-code hide-mobile">{r.code ?? ''}</span>
                <span className="driver-name">
                  {r.forename} <strong>{r.surname}</strong>
                </span>
              </td>
              <td className="hide-mobile">{r.constructor_name}</td>
              <td className="hide-mobile">{r.grid ?? '—'}</td>
              <td className="hide-mobile">{r.laps ?? '—'}</td>
              <td>
                {r.time_text ?? r.status}
                {r.fastest_lap_rank === 1 && (
                  <span className="fastest-lap-badge" title="Fastest Lap">
                    {' '}FL
                  </span>
                )}
              </td>
              <td className="points">{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
