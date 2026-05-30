import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SeasonPage from './pages/SeasonPage';
import RacePage from './pages/RacePage';
import StandingsPage from './pages/StandingsPage';

const CURRENT_SEASON = new Date().getFullYear();

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/season/:year" element={<SeasonPage />} />
          <Route path="/season/:year/race/:round" element={<RacePage />} />
          <Route path="/standings/:year" element={<StandingsPage />} />
          <Route path="/standings" element={<Navigate to={`/standings/${CURRENT_SEASON}`} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
