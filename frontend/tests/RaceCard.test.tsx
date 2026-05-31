import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import RaceCard from '../src/components/RaceCard';
import type { Race } from '../src/types/f1';

const pastRace: Race = {
  id: 1,
  season: 2024,
  round: 1,
  race_name: 'Bahrain Grand Prix',
  circuit_id: 'bahrain',
  circuit_name: 'Bahrain International Circuit',
  locality: 'Sakhir',
  country: 'Bahrain',
  date: '2020-03-22',
  time: '15:00:00Z',
  lat: 26.0325,
  lng: 50.5106,
};

const futureRace: Race = {
  ...pastRace,
  id: 2,
  date: '2099-06-15',
  race_name: 'Future Grand Prix',
};

function renderCard(race: Race, winner?: string, winnerTeam?: string) {
  return render(
    <MemoryRouter>
      <RaceCard race={race} winner={winner} winnerTeam={winnerTeam} />
    </MemoryRouter>,
  );
}

describe('RaceCard', () => {
  it('renders race name', () => {
    renderCard(pastRace);
    expect(screen.getByText('Bahrain Grand Prix')).toBeInTheDocument();
  });

  it('renders round number', () => {
    renderCard(pastRace);
    expect(screen.getByText('R1')).toBeInTheDocument();
  });

  it('renders circuit and country', () => {
    renderCard(pastRace);
    expect(screen.getByText(/Bahrain International Circuit/)).toBeInTheDocument();
    expect(screen.getAllByText(/Bahrain/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders winner when provided for past race', () => {
    renderCard(pastRace, 'Verstappen', 'Red Bull');
    expect(screen.getByText(/Verstappen/)).toBeInTheDocument();
    expect(screen.getByText(/Red Bull/)).toBeInTheDocument();
  });

  it('does not render winner for future race', () => {
    renderCard(futureRace, 'Verstappen');
    expect(screen.queryByText(/Verstappen/)).not.toBeInTheDocument();
  });

  it('shows upcoming badge for future race', () => {
    renderCard(futureRace);
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('links to correct race page', () => {
    renderCard(pastRace);
    const link = screen.getByTestId('race-card');
    expect(link.getAttribute('href')).toBe('/season/2024/race/1');
  });
});
