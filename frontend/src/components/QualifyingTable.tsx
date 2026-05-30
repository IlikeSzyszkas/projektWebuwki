import type { QualifyingResult } from '../types/f1';

interface Props {
  results: QualifyingResult[];
}

function positionClass(pos: number): string {
  if (pos === 1) return 'pos pos--gold';
  if (pos === 2) return 'pos pos--silver';
  if (pos === 3) return 'pos pos--bronze';
  return 'pos';
}

export default function QualifyingTable({ results }: Props) {
  if (results.length === 0) {
    return <p className="empty-state">No qualifying results available yet.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="results-table" data-testid="qualifying-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>No.</th>
            <th>Driver</th>
            <th className="hide-mobile">Team</th>
            <th>Q1</th>
            <th className="hide-mobile">Q2</th>
            <th className="hide-mobile">Q3</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.driver_id}>
              <td>
                <span className={positionClass(r.position)}>{r.position}</span>
              </td>
              <td className="driver-number">{r.permanent_number ?? r.code ?? '—'}</td>
              <td>
                <span className="driver-code hide-mobile">{r.code ?? ''}</span>
                <span className="driver-name">
                  {r.forename} <strong>{r.surname}</strong>
                </span>
              </td>
              <td className="hide-mobile">{r.constructor_name}</td>
              <td>{r.q1 ?? '—'}</td>
              <td className="hide-mobile">{r.q2 ?? '—'}</td>
              <td className="hide-mobile">{r.q3 ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
