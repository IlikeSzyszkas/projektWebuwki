import dotenv from 'dotenv';
dotenv.config();

import { getDb } from '../src/database';

const db = getDb();

console.log('Seeding database with F1 fixture data...');

db.exec(`
  INSERT OR IGNORE INTO circuits (circuit_id, name, locality, country, lat, lng)
  VALUES
    ('bahrain', 'Bahrain International Circuit', 'Sakhir', 'Bahrain', 26.0325, 50.5106),
    ('jeddah', 'Jeddah Corniche Circuit', 'Jeddah', 'Saudi Arabia', 21.6319, 39.1044),
    ('albert_park', 'Albert Park Grand Prix Circuit', 'Melbourne', 'Australia', -37.8497, 144.968),
    ('suzuka', 'Suzuka Circuit', 'Suzuka', 'Japan', 34.8431, 136.541),
    ('miami', 'Miami International Autodrome', 'Miami', 'USA', 25.9581, -80.2389),
    ('imola', 'Autodromo Enzo e Dino Ferrari', 'Imola', 'Italy', 44.3439, 11.7167),
    ('monaco', 'Circuit de Monaco', 'Monte-Carlo', 'Monaco', 43.7338, 7.42056),
    ('catalunya', 'Circuit de Barcelona-Catalunya', 'Montmelo', 'Spain', 41.57, 2.26111),
    ('villeneuve', 'Circuit Gilles Villeneuve', 'Montreal', 'Canada', 45.5, -73.5228),
    ('silverstone', 'Silverstone Circuit', 'Silverstone', 'UK', 52.0786, -1.01694),
    ('hungaroring', 'Hungaroring', 'Budapest', 'Hungary', 47.5789, 19.2486),
    ('spa', 'Circuit de Spa-Francorchamps', 'Spa', 'Belgium', 50.4372, 5.97139),
    ('zandvoort', 'Circuit Zandvoort', 'Zandvoort', 'Netherlands', 52.3888, 4.54092),
    ('monza', 'Autodromo Nazionale di Monza', 'Monza', 'Italy', 45.6156, 9.28111),
    ('marina_bay', 'Marina Bay Street Circuit', 'Marina Bay', 'Singapore', 1.2914, 103.864),
    ('rodriguez', 'Autodromo Hermanos Rodriguez', 'Mexico City', 'Mexico', 19.4042, -99.0907),
    ('americas', 'Circuit of the Americas', 'Austin', 'USA', 30.1328, -97.6411),
    ('interlagos', 'Autodromo Jose Carlos Pace', 'Sao Paulo', 'Brazil', -23.7036, -46.6997),
    ('las_vegas', 'Las Vegas Strip Street Circuit', 'Las Vegas', 'USA', 36.1162, -115.174),
    ('losail', 'Losail International Circuit', 'Al Daayen', 'Qatar', 25.49, 51.4542),
    ('yas_marina', 'Yas Marina Circuit', 'Abu Dhabi', 'UAE', 24.4672, 54.6031);
`);

db.exec(`
  INSERT OR IGNORE INTO drivers (driver_id, code, permanent_number, forename, surname, nationality)
  VALUES
    ('max_verstappen', 'VER', '1', 'Max', 'Verstappen', 'Dutch'),
    ('sergio_perez', 'PER', '11', 'Sergio', 'Perez', 'Mexican'),
    ('lewis_hamilton', 'HAM', '44', 'Lewis', 'Hamilton', 'British'),
    ('george_russell', 'RUS', '63', 'George', 'Russell', 'British'),
    ('carlos_sainz', 'SAI', '55', 'Carlos', 'Sainz', 'Spanish'),
    ('charles_leclerc', 'LEC', '16', 'Charles', 'Leclerc', 'Monegasque'),
    ('lando_norris', 'NOR', '4', 'Lando', 'Norris', 'British'),
    ('oscar_piastri', 'PIA', '81', 'Oscar', 'Piastri', 'Australian'),
    ('fernando_alonso', 'ALO', '14', 'Fernando', 'Alonso', 'Spanish'),
    ('lance_stroll', 'STR', '18', 'Lance', 'Stroll', 'Canadian'),
    ('esteban_ocon', 'OCO', '31', 'Esteban', 'Ocon', 'French'),
    ('pierre_gasly', 'GAS', '10', 'Pierre', 'Gasly', 'French'),
    ('alexander_albon', 'ALB', '23', 'Alexander', 'Albon', 'Thai'),
    ('logan_sargeant', 'SAR', '2', 'Logan', 'Sargeant', 'American'),
    ('valtteri_bottas', 'BOT', '77', 'Valtteri', 'Bottas', 'Finnish'),
    ('zhou', 'ZHO', '24', 'Guanyu', 'Zhou', 'Chinese'),
    ('kevin_magnussen', 'MAG', '20', 'Kevin', 'Magnussen', 'Danish'),
    ('nico_hulkenberg', 'HUL', '27', 'Nico', 'Hulkenberg', 'German'),
    ('yuki_tsunoda', 'TSU', '22', 'Yuki', 'Tsunoda', 'Japanese'),
    ('daniel_ricciardo', 'RIC', '3', 'Daniel', 'Ricciardo', 'Australian');
`);

db.exec(`
  INSERT OR IGNORE INTO constructors (constructor_id, name, nationality)
  VALUES
    ('red_bull', 'Red Bull', 'Austrian'),
    ('mercedes', 'Mercedes', 'German'),
    ('ferrari', 'Ferrari', 'Italian'),
    ('mclaren', 'McLaren', 'British'),
    ('aston_martin', 'Aston Martin', 'British'),
    ('alpine', 'Alpine F1 Team', 'French'),
    ('williams', 'Williams', 'British'),
    ('alphatauri', 'AlphaTauri', 'Italian'),
    ('alfa', 'Alfa Romeo', 'Swiss'),
    ('haas', 'Haas F1 Team', 'American');
`);

db.exec(`
  INSERT OR IGNORE INTO races (season, round, race_name, circuit_id, date)
  VALUES
    (2024, 1, 'Bahrain Grand Prix', 'bahrain', '2024-03-02'),
    (2024, 2, 'Saudi Arabian Grand Prix', 'jeddah', '2024-03-09'),
    (2024, 3, 'Australian Grand Prix', 'albert_park', '2024-03-24'),
    (2024, 4, 'Japanese Grand Prix', 'suzuka', '2024-04-07'),
    (2024, 5, 'Chinese Grand Prix', 'shanghai', '2024-04-21'),
    (2024, 6, 'Miami Grand Prix', 'miami', '2024-05-05'),
    (2024, 7, 'Emilia Romagna Grand Prix', 'imola', '2024-05-19'),
    (2024, 8, 'Monaco Grand Prix', 'monaco', '2024-05-26'),
    (2024, 9, 'Canadian Grand Prix', 'villeneuve', '2024-06-09'),
    (2024, 10, 'Spanish Grand Prix', 'catalunya', '2024-06-23'),
    (2024, 11, 'Austrian Grand Prix', 'red_bull_ring', '2024-06-30'),
    (2024, 12, 'British Grand Prix', 'silverstone', '2024-07-07'),
    (2024, 13, 'Hungarian Grand Prix', 'hungaroring', '2024-07-21'),
    (2024, 14, 'Belgian Grand Prix', 'spa', '2024-07-28'),
    (2024, 15, 'Dutch Grand Prix', 'zandvoort', '2024-08-25'),
    (2024, 16, 'Italian Grand Prix', 'monza', '2024-09-01'),
    (2024, 17, 'Azerbaijan Grand Prix', 'baku', '2024-09-15'),
    (2024, 18, 'Singapore Grand Prix', 'marina_bay', '2024-09-22'),
    (2024, 19, 'United States Grand Prix', 'americas', '2024-10-20'),
    (2024, 20, 'Mexico City Grand Prix', 'rodriguez', '2024-10-27'),
    (2024, 21, 'São Paulo Grand Prix', 'interlagos', '2024-11-03'),
    (2024, 22, 'Las Vegas Grand Prix', 'las_vegas', '2024-11-23'),
    (2024, 23, 'Qatar Grand Prix', 'losail', '2024-12-01'),
    (2024, 24, 'Abu Dhabi Grand Prix', 'yas_marina', '2024-12-08');
`);

console.log('Seed data inserted successfully.');
console.log('Note: Live results will be fetched from Jolpica API on first request.');

db.close();
