CREATE TABLE teachers (
  user_id UUID NOT NULL REFERENCES users(id),
  reserved_disk_bytes BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
