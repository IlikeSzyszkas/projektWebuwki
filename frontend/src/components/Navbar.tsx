import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CURRENT_SEASON = new Date().getFullYear();

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link nav-link--active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo">F1</span>
          <span className="navbar__title">Results</span>
        </Link>

        <button
          className={`navbar__burger${menuOpen ? ' navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar__links${menuOpen ? ' navbar__links--open' : ''}`}>
          <NavLink to={`/season/${CURRENT_SEASON}`} className={navClass} onClick={() => setMenuOpen(false)}>
            Season {CURRENT_SEASON}
          </NavLink>
          <NavLink to={`/standings/${CURRENT_SEASON}`} className={navClass} onClick={() => setMenuOpen(false)}>
            Standings
          </NavLink>

          <select
            className="navbar__season-select"
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                navigate(`/season/${e.target.value}`);
                setMenuOpen(false);
              }
            }}
          >
            <option value="" disabled>
              Past seasons
            </option>
            {Array.from({ length: CURRENT_SEASON - 1950 }, (_, i) => CURRENT_SEASON - 1 - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}
