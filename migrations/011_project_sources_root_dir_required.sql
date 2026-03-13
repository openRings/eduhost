UPDATE project_sources
SET root_dir = '/'
WHERE root_dir IS NULL;

ALTER TABLE project_sources
  ALTER COLUMN root_dir SET DEFAULT '/',
  ALTER COLUMN root_dir SET NOT NULL;
