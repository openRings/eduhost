ALTER TABLE project_sources
  ADD COLUMN repository_url TEXT;

UPDATE project_sources ps
SET repository_url = gb.url
FROM git_branches gb
WHERE gb.id = ps.git_branch_id;

CREATE TABLE git_branches_new (
  id UUID PRIMARY KEY,
  project_source_id UUID NOT NULL REFERENCES project_sources(id),
  name TEXT NOT NULL,
  is_exists BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (project_source_id, name)
);

INSERT INTO git_branches_new (id, project_source_id, name, is_exists)
SELECT
  (
    substr(md5(ps.id::TEXT || ':' || gb.name), 1, 8) || '-' ||
    substr(md5(ps.id::TEXT || ':' || gb.name), 9, 4) || '-' ||
    substr(md5(ps.id::TEXT || ':' || gb.name), 13, 4) || '-' ||
    substr(md5(ps.id::TEXT || ':' || gb.name), 17, 4) || '-' ||
    substr(md5(ps.id::TEXT || ':' || gb.name), 21, 12)
  )::UUID,
  ps.id,
  gb.name,
  gb.is_exists
FROM project_sources ps
JOIN git_branches gb ON gb.id = ps.git_branch_id;

ALTER TABLE project_sources
  DROP CONSTRAINT project_sources_git_branch_id_fkey;

UPDATE project_sources ps
SET git_branch_id = (
  (
    substr(md5(ps.id::TEXT || ':' || gb.name), 1, 8) || '-' ||
    substr(md5(ps.id::TEXT || ':' || gb.name), 9, 4) || '-' ||
    substr(md5(ps.id::TEXT || ':' || gb.name), 13, 4) || '-' ||
    substr(md5(ps.id::TEXT || ':' || gb.name), 17, 4) || '-' ||
    substr(md5(ps.id::TEXT || ':' || gb.name), 21, 12)
  )::UUID
)
FROM git_branches gb
WHERE gb.id = ps.git_branch_id;

DROP TABLE git_branches;

ALTER TABLE git_branches_new RENAME TO git_branches;

ALTER TABLE project_sources
  ALTER COLUMN repository_url SET NOT NULL,
  ADD CONSTRAINT project_sources_git_branch_id_fkey
    FOREIGN KEY (git_branch_id) REFERENCES git_branches(id);
