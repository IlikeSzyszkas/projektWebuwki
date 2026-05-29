import * as api from '../src/services/f1ApiService';

jest.mock('axios');
import axios from 'axios';

const mockGet = jest.fn();
const mockAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  mockGet.mockReset();
  api.resetClient();
  mockAxios.create.mockReturnValue({ get: mockGet } as any);
});

describe('f1ApiService', () => {
  describe('fetchSeasons', () => {
    it('returns seasons in reverse chronological order', async () => {
      mockGet.mockResolvedValueOnce({
        data: {
          MRData: {
            SeasonTable: {
              Seasons: [{ season: '2022' }, { season: '2023' }, { season: '2024' }],
            },
          },
        },
      });

      const seasons = await api.fetchSeasons();
      expect(seasons).toEqual(['2024', '2023', '2022']);
    });

    it('throws when API fails', async () => {
      mockGet.mockRejectedValueOnce(new Error('Network error'));
      await expect(api.fetchSeasons()).rejects.toThrow('Network error');
    });
  });

  describe('fetchRaces', () => {
    it('returns races for a given season', async () => {
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
        },
      ];
      mockGet.mockResolvedValueOnce({
        data: { MRData: { RaceTable: { Races: mockRaces } } },
      });

      const races = await api.fetchRaces(2024);
      expect(races).toHaveLength(1);
      expect(races[0].raceName).toBe('Bahrain Grand Prix');
    });
  });

  describe('fetchRaceResults', () => {
    it('returns first race from results', async () => {
      const mockRace = {
        season: '2024',
        round: '1',
        raceName: 'Bahrain Grand Prix',
        Circuit: {
          circuitId: 'bahrain',
          circuitName: 'Bahrain International Circuit',
          Location: { locality: 'Sakhir', country: 'Bahrain', lat: '26.0325', long: '50.5106' },
        },
        date: '2024-03-02',
        Results: [],
      };
      mockGet.mockResolvedValueOnce({
        data: { MRData: { RaceTable: { Races: [mockRace] } } },
      });

      const race = await api.fetchRaceResults(2024, 1);
      expect(race).not.toBeNull();
      expect(race?.raceName).toBe('Bahrain Grand Prix');
    });

    it('returns null when no results available', async () => {
      mockGet.mockResolvedValueOnce({
        data: { MRData: { RaceTable: { Races: [] } } },
      });

      const race = await api.fetchRaceResults(2024, 99);
      expect(race).toBeNull();
    });
  });

  describe('fetchDriverStandings', () => {
    it('returns empty array when no standings lists', async () => {
      mockGet.mockResolvedValueOnce({
        data: { MRData: { StandingsTable: { StandingsLists: [] } } },
      });

      const standings = await api.fetchDriverStandings(2024);
      expect(standings).toEqual([]);
    });

    it('returns driver standings from first list', async () => {
      const mockStanding = {
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
        Constructors: [{ constructorId: 'red_bull', name: 'Red Bull', nationality: 'Austrian' }],
      };
      mockGet.mockResolvedValueOnce({
        data: {
          MRData: {
            StandingsTable: {
              StandingsLists: [{ DriverStandings: [mockStanding] }],
            },
          },
        },
      });

      const standings = await api.fetchDriverStandings(2023);
      expect(standings).toHaveLength(1);
      expect(standings[0].Driver.driverId).toBe('max_verstappen');
    });
  });

  describe('fetchConstructorStandings', () => {
    it('returns constructor standings', async () => {
      const mockStanding = {
        position: '1',
        positionText: '1',
        points: '860',
        wins: '21',
        Constructor: { constructorId: 'red_bull', name: 'Red Bull', nationality: 'Austrian' },
      };
      mockGet.mockResolvedValueOnce({
        data: {
          MRData: {
            StandingsTable: {
              StandingsLists: [{ ConstructorStandings: [mockStanding] }],
            },
          },
        },
      });

      const standings = await api.fetchConstructorStandings(2023);
      expect(standings).toHaveLength(1);
      expect(standings[0].Constructor.name).toBe('Red Bull');
    });
  });

  describe('fetchDriver', () => {
    it('returns driver info', async () => {
      mockGet.mockResolvedValueOnce({
        data: {
          MRData: {
            DriverTable: {
              Drivers: [
                {
                  driverId: 'hamilton',
                  code: 'HAM',
                  givenName: 'Lewis',
                  familyName: 'Hamilton',
                  nationality: 'British',
                },
              ],
            },
          },
        },
      });

      const driver = await api.fetchDriver('hamilton');
      expect(driver).not.toBeNull();
      expect(driver?.familyName).toBe('Hamilton');
    });

    it('returns null for unknown driver', async () => {
      mockGet.mockResolvedValueOnce({
        data: { MRData: { DriverTable: { Drivers: [] } } },
      });

      const driver = await api.fetchDriver('unknown_driver');
      expect(driver).toBeNull();
    });
  });
});
