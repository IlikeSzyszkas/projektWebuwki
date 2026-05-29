export interface Race {
  id: number;
  season: number;
  round: number;
  race_name: string;
  circuit_id: string;
  circuit_name: string;
  locality: string;
  country: string;
  date: string;
  time: string | null;
  lat: number;
  lng: number;
}

export interface RaceResult {
  position: number | null;
  position_text: string;
  grid: number | null;
  laps: number | null;
  status: string;
  points: number;
  time_text: string | null;
  fastest_lap_rank: number | null;
  fastest_lap_time: string | null;
  fastest_lap_speed: string | null;
  driver_id: string;
  code: string | null;
  permanent_number: string | null;
  forename: string;
  surname: string;
  nationality: string | null;
  constructor_id: string;
  constructor_name: string;
  constructor_nationality: string | null;
}

export interface QualifyingResult {
  position: number;
  q1: string | null;
  q2: string | null;
  q3: string | null;
  driver_id: string;
  code: string | null;
  permanent_number: string | null;
  forename: string;
  surname: string;
  nationality: string | null;
  constructor_id: string;
  constructor_name: string;
  constructor_nationality: string | null;
}

export interface DriverStanding {
  position: number;
  points: number;
  wins: number;
  driver_id: string;
  code: string | null;
  permanent_number: string | null;
  forename: string;
  surname: string;
  nationality: string | null;
}

export interface ConstructorStanding {
  position: number;
  points: number;
  wins: number;
  constructor_id: string;
  constructor_name: string;
  nationality: string | null;
}

export interface SeasonsResponse {
  seasons: number[];
}

export interface RacesResponse {
  season: number;
  races: Race[];
}

export interface ResultsResponse {
  season: number;
  round: number;
  results: RaceResult[];
  qualifying: QualifyingResult[];
}

export interface StandingsResponse<T> {
  season: number;
  standings: T[];
}
