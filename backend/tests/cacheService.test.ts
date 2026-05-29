import Database from 'better-sqlite3';
import * as dbModule from '../src/database';
import * as api from '../src/services/f1ApiService';
import { getSeasons, getRaces, getDriverStandings, getConstructorStandings } from '../src/services/cacheService';

jest.mock('../src/services/f1ApiService');
const mockedApi = api as jest.Mocked<typeof api>;

let testDb: Database.Database;

jest.mock('../src/database', () => ({
  getDb: jest.fn(),
}));

const mockedGetDb = dbModule.getDb as jest.MockedFunction<typeof dbModule.getDb>;

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE seasons (year INTEGER PRIMARY KEY, fetched_at INTEGER NOT NULL);
    CREATE TABLE circuits (
      circuit_id TEXT PRIMARY KEY, name TEXT NOT NULL, locality TEXT, country TEXT, lat REAL, lng REAL, url TEXT
    );
    CREATE TABLE races (
      id INTEGER PRIMARY KEY AUTOINCREMENT, season INTEGER NOT NULL, round INTEGER NOT NULL,
      race_name TEXT NOT NULL, circuit_id TEXT NOT NULL, date TEXT, time TEXT, UNIQUE(season, round)
    );
    CREATE TABLE drivers (
      driver_id TEXT PRIMARY KEY, code TEXT, permanent_number TEXT,
      forename TEXT NOT NULL, surname TEXT NOT NULL, date_of_birth TEXT, nationality TEXT, url TEXT
    );
    CREATE TABLE constructors (constructor_id TEXT PRIMARY KEY, name TEXT NOT NULL, nationality TEXT, url TEXT);
    CREATE TABLE race_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT, race_id INTEGER NOT NULL, position INTEGER, position_text TEXT,
      driver_id TEXT NOT NULL, constructor_id TEXT NOT NULL, grid INTEGER, laps INTEGER, status TEXT,
      points REAL DEFAULT 0, time_millis INTEGER, time_text TEXT, fastest_lap_rank INTEGER,
      fastest_lap_time TEXT, fastest_lap_speed TEXT, UNIQUE(race_id, driver_id)
    );
    CREATE TABLE qualifying_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT, race_id INTEGER NOT NULL, position INTEGER NOT NULL,
      driver_id TEXT NOT NULL, constructor_id TEXT NOT NULL, q1 TEXT, q2 TEXT, q3 TEXT, UNIQUE(race_id, driver_id)
    );
    CREATE TABLE driver_standings (
      id INTEGER PRIMARY KEY AUTOINCREMENT, season INTEGER NOT NULL, driver_id TEXT NOT NULL,
      position INTEGER, points REAL DEFAULT 0, wins INTEGER DEFAULT 0, UNIQUE(season, driver_id)
    );
    CREATE TABLE constructor_standings (
      id INTEGER PRIMARY KEY AUTOINCREMENT, season INTEGER NOT NULL, constructor_id TEXT NOT NULL,
      position INTEGER, points REAL DEFAULT 0, wins INTEGER DEFAULT 0, UNIQUE(season, constructor_id)
    );
    CREATE TABLE api_cache (cache_key TEXT PRIMARY KEY, fetched_at INTEGER NOT NULL);
  `);
  return db;
}

beforeEach(() => {
  testDb = createTestDb();
  mockedGetDb.mockReturnValue(testDb);
  jest.clearAllMocks();
});

afterEach(() => {
  testDb.close();
});

describe('cacheService - getSeasons', () => {
  it('fetches from API and stores in DB on cache miss', async () => {
    mockedApi.fetchSeasons.mockResolvedValue(['2024', '2023', '2022']);

    const seasons = await getSeasons();
    expect(mockedApi.fetchSeasons).toHaveBeenCalledTimes(1);
    expect(seasons).toEqual([2024, 2023, 2022]);

    const rows = testDb.prepare('SELECT year FROM seasons ORDER BY year DESC').all();
    expect(rows).toHaveLength(3);
  });

  it('uses cached data when cache is valid', async () => {
    testDb.prepare('INSERT INTO seasons (year, fetched_at) VALUES (?, ?)').run(2024, Date.now());
    testDb.prepare('INSERT INTO api_cache (cache_key, fetched_at) VALUES (?, ?)').run('seasons', Date.now());

    const seasons = await getSeasons();
    expect(mockedApi.fetchSeasons).not.toHaveBeenCalled();
    expect(seasons).toEqual([2024]);
  });
});

describe('cacheService - getRaces', () => {
  it('fetches and stores races from API', async () => {
    const mockRaces = [
      {
        season: '2024',
        round: '1',
        raceName: 'Bahrain Grand Prix',
        Circuit: {
          circuitId: 'bahrain',
          circuitName: 'Bahrain International Circuit',
          Location: { locality: 'Sakhir', country: 'Bahrain', lat: '26.0325', long: '50.5106' },
        },
        date: '2024-03-02',
        time: '15:00:00Z',
      },
    ];
    mockedApi.fetchRaces.mockResolvedValue(mockRaces);

    const races = await getRaces(2024);
    expect(mockedApi.fetchRaces).toHaveBeenCalledWith(2024);
    expect(races).toHaveLength(1);
    expect(races[0].race_name).toBe('Bahrain Grand Prix');
  });
});

describe('cacheService - getDriverStandings', () => {
  it('fetches and stores driver standings', async () => {
    const mockStandings = [
      {
        position: '1',
        positionText: '1',
        points: '575',
        wins: '19',
        Driver: {
          driverId: 'max_verstappen',
          code: 'VER',
          givenName: 'Max',
          familyName: 'Verstappen',
          nationality: 'Dutch',
        },
        Constructors: [],
      },
    ];
    mockedApi.fetchDriverStandings.mockResolvedValue(mockStandings);

    const standings = await getDriverStandings(2023);
    expect(mockedApi.fetchDriverStandings).toHaveBeenCalledWith(2023);
    expect(standings).toHaveLength(1);
    expect(standings[0].driver_id).toBe('max_verstappen');
    expect(standings[0].points).toBe(575);
  });
});

describe('cacheService - getConstructorStandings', () => {
  it('fetches and stores constructor standings', async () => {
    const mockStandings = [
      {
        position: '1',
        positionText: '1',
        points: '860',
        wins: '21',
        Constructor: { constructorId: 'red_bull', name: 'Red Bull', nationality: 'Austrian' },
      },
    ];
    mockedApi.fetchConstructorStandings.mockResolvedValue(mockStandings);

    const standings = await getConstructorStandings(2023);
    expect(standings).toHaveLength(1);
    expect(standings[0].constructor_name).toBe('Red Bull');
  });
});
