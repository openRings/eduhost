CREATE TABLE subjects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  reserved_disk_bytes BIGINT NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL
);
