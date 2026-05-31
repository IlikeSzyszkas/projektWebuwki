import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navbar from '../src/components/Navbar';

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );
}

describe('Navbar', () => {
  it('renders the F1 brand logo', () => {
    renderNavbar();
    expect(screen.getByText('F1')).toBeInTheDocument();
    expect(screen.getByText('Results')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderNavbar();
    expect(screen.getByText(/Season \d{4}/)).toBeInTheDocument();
    expect(screen.getByText('Standings')).toBeInTheDocument();
  });

  it('renders season select dropdown', () => {
    renderNavbar();
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('toggles mobile menu on burger click', () => {
    renderNavbar();
    const burger = screen.getByLabelText('Toggle menu');
    const links = document.querySelector('.navbar__links');
    expect(links?.classList.contains('navbar__links--open')).toBe(false);
    fireEvent.click(burger);
    expect(links?.classList.contains('navbar__links--open')).toBe(true);
    fireEvent.click(burger);
    expect(links?.classList.contains('navbar__links--open')).toBe(false);
  });
});
