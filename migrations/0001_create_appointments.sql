CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'requested',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments (date, time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status);

CREATE TABLE IF NOT EXISTS blocks (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blocks_date_time ON blocks (date, time);
