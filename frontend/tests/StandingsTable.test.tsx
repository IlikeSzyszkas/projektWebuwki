import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DriverStandingsTable, ConstructorStandingsTable } from '../src/components/StandingsTable';
import type { DriverStanding, ConstructorStanding } from '../src/types/f1';

const mockDriverStandings: DriverStanding[] = [
  {
    position: 1,
    points: 575,
    wins: 19,
    driver_id: 'max_verstappen',
    code: 'VER',
    permanent_number: '1',
    forename: 'Max',
    surname: 'Verstappen',
    nationality: 'Dutch',
  },
  {
    position: 2,
    points: 285,
    wins: 2,
    driver_id: 'sergio_perez',
    code: 'PER',
    permanent_number: '11',
    forename: 'Sergio',
    surname: 'Perez',
    nationality: 'Mexican',
  },
];

const mockConstructorStandings: ConstructorStanding[] = [
  { position: 1, points: 860, wins: 21, constructor_id: 'red_bull', constructor_name: 'Red Bull', nationality: 'Austrian' },
  { position: 2, points: 409, wins: 0, constructor_id: 'mercedes', constructor_name: 'Mercedes', nationality: 'German' },
];

describe('DriverStandingsTable', () => {
  it('shows empty state when no standings', () => {
    render(<DriverStandingsTable standings={[]} />);
    expect(screen.getByText(/No standings available/)).toBeInTheDocument();
  });

  it('renders driver names', () => {
    render(<DriverStandingsTable standings={mockDriverStandings} />);
    expect(screen.getByText('Verstappen')).toBeInTheDocument();
    expect(screen.getByText('Perez')).toBeInTheDocument();
  });

  it('renders points', () => {
    render(<DriverStandingsTable standings={mockDriverStandings} />);
    expect(screen.getByText('575')).toBeInTheDocument();
  });

  it('renders the correct table', () => {
    render(<DriverStandingsTable standings={mockDriverStandings} />);
    expect(screen.getByTestId('driver-standings-table')).toBeInTheDocument();
  });

  it('marks position 1 with gold badge', () => {
    render(<DriverStandingsTable standings={mockDriverStandings} />);
    const gold = document.querySelector('.pos--gold');
    expect(gold).toBeInTheDocument();
  });
});

describe('ConstructorStandingsTable', () => {
  it('shows empty state when no standings', () => {
    render(<ConstructorStandingsTable standings={[]} />);
    expect(screen.getByText(/No standings available/)).toBeInTheDocument();
  });

  it('renders constructor names', () => {
    render(<ConstructorStandingsTable standings={mockConstructorStandings} />);
    expect(screen.getByText('Red Bull')).toBeInTheDocument();
    expect(screen.getByText('Mercedes')).toBeInTheDocument();
  });

  it('renders the correct table', () => {
    render(<ConstructorStandingsTable standings={mockConstructorStandings} />);
    expect(screen.getByTestId('constructor-standings-table')).toBeInTheDocument();
  });
});
