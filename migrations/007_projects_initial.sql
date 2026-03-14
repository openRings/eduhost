CREATE TABLE github_branches (
  id UUID PRIMARY KEY,
  repository_full_name TEXT NOT NULL,
  name TEXT NOT NULL,
  is_exists BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE project_sources (
  id UUID PRIMARY KEY,
  repository_full_name TEXT NOT NULL,
  branch_id UUID NOT NULL REFERENCES github_branches(id),
  size_bytes BIGINT NOT NULL,
  root_dir TEXT NOT NULL DEFAULT('/'),
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  alias TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES users(id),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  source_id UUID REFERENCES project_sources(id),
  database_id UUID REFERENCES databases(id),
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE project_users (
  user_id UUID NOT NULL REFERENCES users(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  permissions TEXT[] NOT NULL,
  is_accepted BOOLEAN NOT NULL,
  PRIMARY KEY (user_id, project_id)
);

