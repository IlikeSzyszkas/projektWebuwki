import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ResultsTable from '../src/components/ResultsTable';
import type { RaceResult } from '../src/types/f1';

const mockResults: RaceResult[] = [
  {
    position: 1,
    position_text: '1',
    grid: 1,
    laps: 57,
    status: 'Finished',
    points: 25,
    time_text: '1:30:00.000',
    fastest_lap_rank: 1,
    fastest_lap_time: '1:33.000',
    fastest_lap_speed: '220',
    driver_id: 'max_verstappen',
    code: 'VER',
    permanent_number: '1',
    forename: 'Max',
    surname: 'Verstappen',
    nationality: 'Dutch',
    constructor_id: 'red_bull',
    constructor_name: 'Red Bull',
    constructor_nationality: 'Austrian',
  },
  {
    position: 2,
    position_text: '2',
    grid: 3,
    laps: 57,
    status: 'Finished',
    points: 18,
    time_text: '+5.023',
    fastest_lap_rank: null,
    fastest_lap_time: null,
    fastest_lap_speed: null,
    driver_id: 'sergio_perez',
    code: 'PER',
    permanent_number: '11',
    forename: 'Sergio',
    surname: 'Perez',
    nationality: 'Mexican',
    constructor_id: 'red_bull',
    constructor_name: 'Red Bull',
    constructor_nationality: 'Austrian',
  },
];

describe('ResultsTable', () => {
  it('renders empty state when no results', () => {
    render(<ResultsTable results={[]} />);
    expect(screen.getByText(/No race results available/)).toBeInTheDocument();
  });

  it('renders results table with correct data', () => {
    render(<ResultsTable results={mockResults} />);
    expect(screen.getByTestId('results-table')).toBeInTheDocument();
  });

  it('renders driver surnames', () => {
    render(<ResultsTable results={mockResults} />);
    expect(screen.getByText('Verstappen')).toBeInTheDocument();
    expect(screen.getByText('Perez')).toBeInTheDocument();
  });

  it('renders points correctly', () => {
    render(<ResultsTable results={mockResults} />);
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
  });

  it('shows FL badge for fastest lap holder', () => {
    render(<ResultsTable results={mockResults} />);
    expect(screen.getByText(/FL/)).toBeInTheDocument();
  });

  it('renders position 1 with gold styling', () => {
    render(<ResultsTable results={mockResults} />);
    const pos = document.querySelector('.pos--gold');
    expect(pos).toBeInTheDocument();
    expect(pos?.textContent).toBe('1');
  });
});
