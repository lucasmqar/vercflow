
CREATE TABLE raci_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_raci_entity ON raci_assignments(entity_type, entity_id);
CREATE INDEX idx_raci_user_id ON raci_assignments(user_id);
CREATE INDEX idx_raci_role ON raci_assignments(role);
