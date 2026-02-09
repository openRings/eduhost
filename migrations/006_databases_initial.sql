CREATE TABLE databases (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  disk_usage_bytes BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
