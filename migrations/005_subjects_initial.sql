CREATE TABLE subjects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  reserved_disk_bytes BIGINT NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE subject_groups (
  group_id UUID NOT NULL REFERENCES groups(id),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  added_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (group_id, subject_id)
);

