CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  access_token_hash TEXT NOT NULL,
  refresh_token_hash TEXT NOT NULL,
  access_duration INTERVAL NOT NULL,
  refresh_duration INTERVAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
