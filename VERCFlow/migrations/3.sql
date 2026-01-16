
CREATE TABLE disciplines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  current_phase TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_disciplines_project_id ON disciplines(project_id);
CREATE INDEX idx_disciplines_status ON disciplines(status);
CREATE INDEX idx_disciplines_category ON disciplines(category);
