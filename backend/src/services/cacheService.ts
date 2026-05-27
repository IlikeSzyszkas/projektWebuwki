import { getDb } from '../database';
import * as api from './f1ApiService';

const TTL = {
  SEASONS: 24 * 60 * 60 * 1000,       // 24h
  RACES: 6 * 60 * 60 * 1000,           // 6h
  RESULTS: 30 * 24 * 60 * 60 * 1000,   // 30 days (completed races don't change)
  STANDINGS: 60 * 60 * 1000,           // 1h
};

function isCacheValid(key: string, ttl: number): boolean {
  const db = getDb();
  const row = db.prepare('SELECT fetched_at FROM api_cache WHERE cache_key = ?').get(key) as
    | { fetched_at: number }
    | undefined;
  if (!row) return false;
  return Date.now() - row.fetched_at < ttl;
}

function markCached(key: string): void {
  const db = getDb();
  db.prepare('INSERT OR REPLACE INTO api_cache (cache_key, fetched_at) VALUES (?, ?)').run(key, Date.now());
}

function upsertDriver(driver: api.JolpicaDriver): void {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO drivers (driver_id, code, permanent_number, forename, surname, date_of_birth, nationality, url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    driver.driverId,
    driver.code ?? null,
    driver.permanentNumber ?? null,
    driver.givenName,
    driver.familyName,
    driver.dateOfBirth ?? null,
    driver.nationality ?? null,
    driver.url ?? null,
  );
}

function upsertConstructor(ctor: api.JolpicaConstructor): void {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO constructors (constructor_id, name, nationality, url)
    VALUES (?, ?, ?, ?)
  `).run(ctor.constructorId, ctor.name, ctor.nationality ?? null, ctor.url ?? null);
}

function upsertCircuit(circuit: api.JolpicaCircuit): void {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO circuits (circuit_id, name, locality, country, lat, lng, url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    circuit.circuitId,
    circuit.circuitName,
    circuit.Location.locality,
    circuit.Location.country,
    parseFloat(circuit.Location.lat),
    parseFloat(circuit.Location.long),
    circuit.url ?? null,
  );
}

function upsertRace(race: api.JolpicaRace): number {
  const db = getDb();
  upsertCircuit(race.Circuit);
  db.prepare(`
    INSERT OR REPLACE INTO races (season, round, race_name, circuit_id, date, time)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    parseInt(race.season),
    parseInt(race.round),
    race.raceName,
    race.Circuit.circuitId,
    race.date ?? null,
    race.time ?? null,
  );
  const row = db.prepare('SELECT id FROM races WHERE season = ? AND round = ?').get(
    parseInt(race.season),
    parseInt(race.round),
  ) as { id: number };
  return row.id;
}

export async function getSeasons(): Promise<number[]> {
  const db = getDb();
  const cacheKey = 'seasons';

  if (!isCacheValid(cacheKey, TTL.SEASONS)) {
    const seasons = await api.fetchSeasons();
    const insert = db.prepare('INSERT OR REPLACE INTO seasons (year, fetched_at) VALUES (?, ?)');
    const insertMany = db.transaction((seasons: string[]) => {
      for (const s of seasons) insert.run(parseInt(s), Date.now());
    });
    insertMany(seasons);
    markCached(cacheKey);
  }

  const rows = db.prepare('SELECT year FROM seasons ORDER BY year DESC').all() as { year: number }[];
  return rows.map((r) => r.year);
}

export async function getRaces(season: number): Promise<any[]> {
  const db = getDb();
  const cacheKey = `races:${season}`;

  if (!isCacheValid(cacheKey, TTL.RACES)) {
    const races = await api.fetchRaces(season);
    const insertRaces = db.transaction((races: api.JolpicaRace[]) => {
      for (const race of races) upsertRace(race);
    });
    insertRaces(races);
    markCached(cacheKey);
  }

  return db.prepare(`
    SELECT r.id, r.season, r.round, r.race_name, r.date, r.time,
           c.circuit_id, c.name as circuit_name, c.locality, c.country, c.lat, c.lng
    FROM races r
    JOIN circuits c ON r.circuit_id = c.circuit_id
    WHERE r.season = ?
    ORDER BY r.round ASC
  `).all(season);
}

export async function getRaceResults(season: number, round: number): Promise<any[]> {
  const db = getDb();
  const cacheKey = `results:${season}:${round}`;

  if (!isCacheValid(cacheKey, TTL.RESULTS)) {
    const raceData = await api.fetchRaceResults(season, round);
    if (raceData && raceData.Results) {
      const raceId = upsertRace(raceData);
      const insertResult = db.prepare(`
        INSERT OR REPLACE INTO race_results
          (race_id, position, position_text, driver_id, constructor_id, grid, laps, status, points,
           time_millis, time_text, fastest_lap_rank, fastest_lap_time, fastest_lap_speed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const insertAll = db.transaction((results: api.JolpicaResult[]) => {
        for (const r of results) {
          upsertDriver(r.Driver);
          upsertConstructor(r.Constructor);
          insertResult.run(
            raceId,
            parseInt(r.position) || null,
            r.positionText,
            r.Driver.driverId,
            r.Constructor.constructorId,
            parseInt(r.grid) || null,
            parseInt(r.laps) || null,
            r.status,
            parseFloat(r.points) || 0,
            r.Time?.millis ? parseInt(r.Time.millis) : null,
            r.Time?.time ?? null,
            r.FastestLap?.rank ? parseInt(r.FastestLap.rank) : null,
            r.FastestLap?.Time?.time ?? null,
            r.FastestLap?.AverageSpeed?.speed ?? null,
          );
        }
      });
      insertAll(raceData.Results);
      markCached(cacheKey);
    }
  }

  const raceRow = db.prepare('SELECT id FROM races WHERE season = ? AND round = ?').get(season, round) as
    | { id: number }
    | undefined;
  if (!raceRow) return [];

  return db.prepare(`
    SELECT rr.position, rr.position_text, rr.grid, rr.laps, rr.status, rr.points,
           rr.time_text, rr.fastest_lap_rank, rr.fastest_lap_time, rr.fastest_lap_speed,
           d.driver_id, d.code, d.permanent_number, d.forename, d.surname, d.nationality,
           c.constructor_id, c.name as constructor_name, c.nationality as constructor_nationality
    FROM race_results rr
    JOIN drivers d ON rr.driver_id = d.driver_id
    JOIN constructors c ON rr.constructor_id = c.constructor_id
    WHERE rr.race_id = ?
    ORDER BY rr.position ASC NULLS LAST
  `).all(raceRow.id);
}

export async function getQualifyingResults(season: number, round: number): Promise<any[]> {
  const db = getDb();
  const cacheKey = `qualifying:${season}:${round}`;

  if (!isCacheValid(cacheKey, TTL.RESULTS)) {
    const raceData = await api.fetchQualifyingResults(season, round);
    if (raceData && raceData.QualifyingResults) {
      const raceId = upsertRace(raceData);
      const insertQual = db.prepare(`
        INSERT OR REPLACE INTO qualifying_results (race_id, position, driver_id, constructor_id, q1, q2, q3)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const insertAll = db.transaction((results: api.JolpicaQualifyingResult[]) => {
        for (const r of results) {
          upsertDriver(r.Driver);
          upsertConstructor(r.Constructor);
          insertQual.run(raceId, parseInt(r.position), r.Driver.driverId, r.Constructor.constructorId,
            r.Q1 ?? null, r.Q2 ?? null, r.Q3 ?? null);
        }
      });
      insertAll(raceData.QualifyingResults);
      markCached(cacheKey);
    }
  }

  const raceRow = db.prepare('SELECT id FROM races WHERE season = ? AND round = ?').get(season, round) as
    | { id: number }
    | undefined;
  if (!raceRow) return [];

  return db.prepare(`
    SELECT qr.position, qr.q1, qr.q2, qr.q3,
           d.driver_id, d.code, d.permanent_number, d.forename, d.surname, d.nationality,
           c.constructor_id, c.name as constructor_name, c.nationality as constructor_nationality
    FROM qualifying_results qr
    JOIN drivers d ON qr.driver_id = d.driver_id
    JOIN constructors c ON qr.constructor_id = c.constructor_id
    WHERE qr.race_id = ?
    ORDER BY qr.position ASC
  `).all(raceRow.id);
}

export async function getDriverStandings(season: number): Promise<any[]> {
  const db = getDb();
  const cacheKey = `driver_standings:${season}`;

  if (!isCacheValid(cacheKey, TTL.STANDINGS)) {
    const standings = await api.fetchDriverStandings(season);
    const insertStanding = db.prepare(`
      INSERT OR REPLACE INTO driver_standings (season, driver_id, position, points, wins)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertAll = db.transaction((standings: api.JolpicaDriverStanding[]) => {
      for (const s of standings) {
        upsertDriver(s.Driver);
        insertStanding.run(season, s.Driver.driverId, parseInt(s.position), parseFloat(s.points), parseInt(s.wins));
      }
    });
    insertAll(standings);
    markCached(cacheKey);
  }

  return db.prepare(`
    SELECT ds.position, ds.points, ds.wins,
           d.driver_id, d.code, d.permanent_number, d.forename, d.surname, d.nationality
    FROM driver_standings ds
    JOIN drivers d ON ds.driver_id = d.driver_id
    WHERE ds.season = ?
    ORDER BY ds.position ASC
  `).all(season);
}

export async function getConstructorStandings(season: number): Promise<any[]> {
  const db = getDb();
  const cacheKey = `constructor_standings:${season}`;

  if (!isCacheValid(cacheKey, TTL.STANDINGS)) {
    const standings = await api.fetchConstructorStandings(season);
    const insertStanding = db.prepare(`
      INSERT OR REPLACE INTO constructor_standings (season, constructor_id, position, points, wins)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertAll = db.transaction((standings: api.JolpicaConstructorStanding[]) => {
      for (const s of standings) {
        upsertConstructor(s.Constructor);
        insertStanding.run(season, s.Constructor.constructorId, parseInt(s.position), parseFloat(s.points), parseInt(s.wins));
      }
    });
    insertAll(standings);
    markCached(cacheKey);
  }

  return db.prepare(`
    SELECT cs.position, cs.points, cs.wins,
           c.constructor_id, c.name as constructor_name, c.nationality
    FROM constructor_standings cs
    JOIN constructors c ON cs.constructor_id = c.constructor_id
    WHERE cs.season = ?
    ORDER BY cs.position ASC
  `).all(season);
}
