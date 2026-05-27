import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = process.env.DB_DIR || path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DB_DIR, 'f1.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS seasons (
      year INTEGER PRIMARY KEY,
      fetched_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS circuits (
      circuit_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      locality TEXT,
      country TEXT,
      lat REAL,
      lng REAL,
      url TEXT
    );

    CREATE TABLE IF NOT EXISTS races (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      season INTEGER NOT NULL,
      round INTEGER NOT NULL,
      race_name TEXT NOT NULL,
      circuit_id TEXT NOT NULL,
      date TEXT,
      time TEXT,
      UNIQUE(season, round),
      FOREIGN KEY (circuit_id) REFERENCES circuits(circuit_id)
    );

    CREATE TABLE IF NOT EXISTS drivers (
      driver_id TEXT PRIMARY KEY,
      code TEXT,
      permanent_number TEXT,
      forename TEXT NOT NULL,
      surname TEXT NOT NULL,
      date_of_birth TEXT,
      nationality TEXT,
      url TEXT
    );

    CREATE TABLE IF NOT EXISTS constructors (
      constructor_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nationality TEXT,
      url TEXT
    );

    CREATE TABLE IF NOT EXISTS race_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      race_id INTEGER NOT NULL,
      position INTEGER,
      position_text TEXT,
      driver_id TEXT NOT NULL,
      constructor_id TEXT NOT NULL,
      grid INTEGER,
      laps INTEGER,
      status TEXT,
      points REAL DEFAULT 0,
      time_millis INTEGER,
      time_text TEXT,
      fastest_lap_rank INTEGER,
      fastest_lap_time TEXT,
      fastest_lap_speed TEXT,
      UNIQUE(race_id, driver_id),
      FOREIGN KEY (race_id) REFERENCES races(id),
      FOREIGN KEY (driver_id) REFERENCES drivers(driver_id),
      FOREIGN KEY (constructor_id) REFERENCES constructors(constructor_id)
    );

    CREATE TABLE IF NOT EXISTS qualifying_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      race_id INTEGER NOT NULL,
      position INTEGER NOT NULL,
      driver_id TEXT NOT NULL,
      constructor_id TEXT NOT NULL,
      q1 TEXT,
      q2 TEXT,
      q3 TEXT,
      UNIQUE(race_id, driver_id),
      FOREIGN KEY (race_id) REFERENCES races(id),
      FOREIGN KEY (driver_id) REFERENCES drivers(driver_id),
      FOREIGN KEY (constructor_id) REFERENCES constructors(constructor_id)
    );

    CREATE TABLE IF NOT EXISTS driver_standings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      season INTEGER NOT NULL,
      driver_id TEXT NOT NULL,
      position INTEGER,
      points REAL DEFAULT 0,
      wins INTEGER DEFAULT 0,
      UNIQUE(season, driver_id),
      FOREIGN KEY (driver_id) REFERENCES drivers(driver_id)
    );

    CREATE TABLE IF NOT EXISTS constructor_standings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      season INTEGER NOT NULL,
      constructor_id TEXT NOT NULL,
      position INTEGER,
      points REAL DEFAULT 0,
      wins INTEGER DEFAULT 0,
      UNIQUE(season, constructor_id),
      FOREIGN KEY (constructor_id) REFERENCES constructors(constructor_id)
    );

    CREATE TABLE IF NOT EXISTS api_cache (
      cache_key TEXT PRIMARY KEY,
      fetched_at INTEGER NOT NULL
    );
  `);
}

export function closeDb(): void {
  if (db) {
    db.close();
  }
}
