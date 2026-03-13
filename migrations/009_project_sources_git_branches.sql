CREATE TABLE git_branches (
  id UUID PRIMARY KEY,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  is_exists BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (url, name)
);

ALTER TABLE project_sources
  ADD COLUMN git_branch_id UUID;

INSERT INTO git_branches (id, url, name)
SELECT
  (
    substr(md5(ps.link || ':' || ps.branch), 1, 8) || '-' ||
    substr(md5(ps.link || ':' || ps.branch), 9, 4) || '-' ||
    substr(md5(ps.link || ':' || ps.branch), 13, 4) || '-' ||
    substr(md5(ps.link || ':' || ps.branch), 17, 4) || '-' ||
    substr(md5(ps.link || ':' || ps.branch), 21, 12)
  )::UUID,
  ps.link,
  ps.branch
FROM project_sources ps
GROUP BY ps.link, ps.branch;

UPDATE project_sources ps
SET git_branch_id = gb.id
FROM git_branches gb
WHERE gb.url = ps.link
  AND gb.name = ps.branch;

ALTER TABLE project_sources
  ALTER COLUMN git_branch_id SET NOT NULL,
  ADD CONSTRAINT project_sources_git_branch_id_fkey
    FOREIGN KEY (git_branch_id) REFERENCES git_branches(id);

ALTER TABLE project_sources
  DROP COLUMN link,
  DROP COLUMN branch;

