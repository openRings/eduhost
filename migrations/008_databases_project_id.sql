DO $$
BEGIN
  IF EXISTS(
    SELECT 1
    FROM projects p
    WHERE p.database_id IS NOT NULL
    GROUP BY p.database_id
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Cannot migrate: one database is linked to multiple projects';
  END IF;
END $$;

ALTER TABLE databases
  ADD COLUMN project_id UUID;

UPDATE databases d
SET project_id = p.id
FROM projects p
WHERE p.database_id = d.id;

DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM databases d WHERE d.project_id IS NULL) THEN
    RAISE EXCEPTION 'Cannot migrate: found databases not linked to any project';
  END IF;
END $$;

ALTER TABLE databases
  ALTER COLUMN project_id SET NOT NULL,
  ADD CONSTRAINT databases_project_id_key UNIQUE (project_id),
  ADD CONSTRAINT databases_project_id_fkey
    FOREIGN KEY (project_id) REFERENCES projects(id);

ALTER TABLE projects
  DROP COLUMN database_id;
