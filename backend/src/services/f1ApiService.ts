import axios, { type AxiosInstance } from 'axios';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const TIMEOUT_MS = 10000;

let _client: AxiosInstance | null = null;

export function getClient(): AxiosInstance {
  if (!_client) {
    _client = axios.create({
      baseURL: BASE_URL,
      timeout: TIMEOUT_MS,
      headers: { Accept: 'application/json' },
    });
  }
  return _client;
}

export function resetClient(): void {
  _client = null;
}

export interface JolpicaDriver {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality?: string;
  url?: string;
}

export interface JolpicaConstructor {
  constructorId: string;
  name: string;
  nationality?: string;
  url?: string;
}

export interface JolpicaCircuit {
  circuitId: string;
  circuitName: string;
  Location: {
    locality: string;
    country: string;
    lat: string;
    long: string;
  };
  url?: string;
}

export interface JolpicaRace {
  season: string;
  round: string;
  raceName: string;
  Circuit: JolpicaCircuit;
  date: string;
  time?: string;
  Results?: JolpicaResult[];
  QualifyingResults?: JolpicaQualifyingResult[];
}

export interface JolpicaResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: JolpicaDriver;
  Constructor: JolpicaConstructor;
  grid: string;
  laps: string;
  status: string;
  Time?: { millis?: string; time: string };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: { time: string };
    AverageSpeed?: { units: string; speed: string };
  };
}

export interface JolpicaQualifyingResult {
  number: string;
  position: string;
  Driver: JolpicaDriver;
  Constructor: JolpicaConstructor;
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

export interface JolpicaDriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: JolpicaDriver;
  Constructors: JolpicaConstructor[];
}

export interface JolpicaConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: JolpicaConstructor;
}

async function get<T>(path: string): Promise<T> {
  const response = await getClient().get<T>(path);
  return response.data;
}

export async function fetchSeasons(): Promise<string[]> {
  const data = await get<any>('/seasons.json?limit=100');
  const seasons: Array<{ season: string }> = data.MRData.SeasonTable.Seasons;
  return seasons.map((s) => s.season).reverse();
}

export async function fetchRaces(season: string | number): Promise<JolpicaRace[]> {
  const data = await get<any>(`/${season}/races.json`);
  return data.MRData.RaceTable.Races;
}

export async function fetchRaceResults(season: string | number, round: string | number): Promise<JolpicaRace | null> {
  const data = await get<any>(`/${season}/${round}/results.json`);
  const races: JolpicaRace[] = data.MRData.RaceTable.Races;
  return races.length > 0 ? races[0] : null;
}

export async function fetchQualifyingResults(season: string | number, round: string | number): Promise<JolpicaRace | null> {
  const data = await get<any>(`/${season}/${round}/qualifying.json`);
  const races: JolpicaRace[] = data.MRData.RaceTable.Races;
  return races.length > 0 ? races[0] : null;
}

export async function fetchDriverStandings(season: string | number): Promise<JolpicaDriverStanding[]> {
  const data = await get<any>(`/${season}/driverStandings.json`);
  const lists = data.MRData.StandingsTable.StandingsLists;
  if (!lists || lists.length === 0) return [];
  return lists[0].DriverStandings || [];
}

export async function fetchConstructorStandings(season: string | number): Promise<JolpicaConstructorStanding[]> {
  const data = await get<any>(`/${season}/constructorStandings.json`);
  const lists = data.MRData.StandingsTable.StandingsLists;
  if (!lists || lists.length === 0) return [];
  return lists[0].ConstructorStandings || [];
}

export async function fetchDriver(driverId: string): Promise<JolpicaDriver | null> {
  const data = await get<any>(`/drivers/${driverId}.json`);
  const drivers: JolpicaDriver[] = data.MRData.DriverTable.Drivers;
  return drivers.length > 0 ? drivers[0] : null;
}
