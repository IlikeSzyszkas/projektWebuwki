import request from 'supertest';
import app from '../src/app';
import * as cacheService from '../src/services/cacheService';

jest.mock('../src/services/cacheService');
const mocked = cacheService as jest.Mocked<typeof cacheService>;

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/seasons', () => {
  it('returns list of seasons', async () => {
    mocked.getSeasons.mockResolvedValue([2024, 2023, 2022]);
    const res = await request(app).get('/api/seasons');
    expect(res.status).toBe(200);
    expect(res.body.seasons).toEqual([2024, 2023, 2022]);
  });

  it('returns 500 when service throws', async () => {
    mocked.getSeasons.mockRejectedValue(new Error('DB error'));
    const res = await request(app).get('/api/seasons');
    expect(res.status).toBe(500);
  });
});

describe('GET /api/races/:season', () => {
  it('returns races for valid season', async () => {
    const mockRaces = [{ id: 1, season: 2024, round: 1, race_name: 'Bahrain Grand Prix' }];
    mocked.getRaces.mockResolvedValue(mockRaces);
    const res = await request(app).get('/api/races/2024');
    expect(res.status).toBe(200);
    expect(res.body.races).toHaveLength(1);
  });

  it('returns 400 for invalid season', async () => {
    const res = await request(app).get('/api/races/abc');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/results/:season/:round', () => {
  it('returns race and qualifying results', async () => {
    mocked.getRaceResults.mockResolvedValue([{ position: 1, surname: 'Verstappen' }]);
    mocked.getQualifyingResults.mockResolvedValue([{ position: 1, surname: 'Verstappen' }]);
    const res = await request(app).get('/api/results/2024/1');
    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(1);
    expect(res.body.qualifying).toHaveLength(1);
  });

  it('returns 400 for invalid round', async () => {
    const res = await request(app).get('/api/results/2024/0');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/standings/drivers/:season', () => {
  it('returns driver standings', async () => {
    mocked.getDriverStandings.mockResolvedValue([{ position: 1, driver_id: 'max_verstappen' }]);
    const res = await request(app).get('/api/standings/drivers/2024');
    expect(res.status).toBe(200);
    expect(res.body.standings).toHaveLength(1);
  });
});

describe('GET /api/standings/constructors/:season', () => {
  it('returns constructor standings', async () => {
    mocked.getConstructorStandings.mockResolvedValue([{ position: 1, constructor_id: 'red_bull' }]);
    const res = await request(app).get('/api/standings/constructors/2024');
    expect(res.status).toBe(200);
    expect(res.body.standings).toHaveLength(1);
  });
});

describe('GET /api/unknown', () => {
  it('returns 404', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
