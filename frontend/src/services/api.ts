import axios from 'axios';
import type {
  SeasonsResponse,
  RacesResponse,
  ResultsResponse,
  StandingsResponse,
  DriverStanding,
  ConstructorStanding,
} from '../types/f1';

const client = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

export async function fetchSeasons(): Promise<number[]> {
  const { data } = await client.get<SeasonsResponse>('/seasons');
  return data.seasons;
}

export async function fetchRaces(season: number): Promise<RacesResponse> {
  const { data } = await client.get<RacesResponse>(`/races/${season}`);
  return data;
}

export async function fetchResults(season: number, round: number): Promise<ResultsResponse> {
  const { data } = await client.get<ResultsResponse>(`/results/${season}/${round}`);
  return data;
}

export async function fetchDriverStandings(season: number): Promise<StandingsResponse<DriverStanding>> {
  const { data } = await client.get<StandingsResponse<DriverStanding>>(`/standings/drivers/${season}`);
  return data;
}

export async function fetchConstructorStandings(season: number): Promise<StandingsResponse<ConstructorStanding>> {
  const { data } = await client.get<StandingsResponse<ConstructorStanding>>(`/standings/constructors/${season}`);
  return data;
}
