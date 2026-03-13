DELETE FROM databases;

ALTER TABLE projects
DROP COLUMN database_id;

ALTER TABLE databases
ADD COLUMN project_id UUID NOT NULL UNIQUE REFERENCES projects(id);
