use anyhow::Context;
use sqlx::PgExecutor;
use time::OffsetDateTime;
use uuid::Uuid;

pub struct ProjectCreateCommand<'a> {
    pub project_id: Uuid,
    pub name: &'a str,
    pub alias: &'a str,
    pub owner_id: Uuid,
    pub subject_id: Uuid,
}

pub struct ProjectSourceCreateCommand<'a> {
    pub source_id: Uuid,
    pub branch_id: Uuid,
    pub project_id: Uuid,
    pub repository_full_name: &'a str,
    pub root_dir: &'a str,
}

pub struct ProjectSourceUpdateCommand<'a> {
    pub source_id: Uuid,
    pub branch_id: Uuid,
    pub repository_full_name: &'a str,
    pub root_dir: &'a str,
}

impl<'a> ProjectCreateCommand<'a> {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<u64>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query(
            "INSERT INTO projects
            (id, name, alias, owner_id, subject_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6)",
        )
        .bind(self.project_id)
        .bind(self.name)
        .bind(self.alias)
        .bind(self.owner_id)
        .bind(self.subject_id)
        .bind(OffsetDateTime::now_utc())
        .execute(conn)
        .await
        .map(|r| r.rows_affected())
        .context("failed to execute query")
    }
}

impl<'a> ProjectSourceCreateCommand<'a> {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<u64>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query(
            "WITH ensured_branch AS (
                SELECT id
                FROM github_branches
                WHERE repository_full_name = $1 AND name = 'main'
                LIMIT 1
            ),
            inserted_branch AS (
                INSERT INTO github_branches
                (id, repository_full_name, name, is_exists)
                SELECT $2, $1, 'main', TRUE
                WHERE NOT EXISTS (SELECT 1 FROM ensured_branch)
                RETURNING id
            ),
            selected_branch AS (
                SELECT id FROM ensured_branch
                UNION ALL
                SELECT id FROM inserted_branch
                LIMIT 1
            ),
            source_insert AS (
                INSERT INTO project_sources
                (id, repository_full_name, branch_id, size_bytes, root_dir, updated_at)
                VALUES ($3, $1, (SELECT id FROM selected_branch), 0, $4, $5)
            )
            UPDATE projects
            SET source_id = $3
            WHERE id = $6",
        )
        .bind(self.repository_full_name)
        .bind(self.branch_id)
        .bind(self.source_id)
        .bind(self.root_dir)
        .bind(OffsetDateTime::now_utc())
        .bind(self.project_id)
        .execute(conn)
        .await
        .map(|r| r.rows_affected())
        .context("failed to execute query")
    }
}

impl<'a> ProjectSourceUpdateCommand<'a> {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<u64>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query(
            "WITH ensured_branch AS (
                SELECT id
                FROM github_branches
                WHERE repository_full_name = $1 AND name = 'main'
                LIMIT 1
            ),
            inserted_branch AS (
                INSERT INTO github_branches
                (id, repository_full_name, name, is_exists)
                SELECT $2, $1, 'main', TRUE
                WHERE NOT EXISTS (SELECT 1 FROM ensured_branch)
                RETURNING id
            ),
            selected_branch AS (
                SELECT id FROM ensured_branch
                UNION ALL
                SELECT id FROM inserted_branch
                LIMIT 1
            )
            UPDATE project_sources
            SET repository_full_name = $1,
                root_dir = $4,
                updated_at = $5,
                branch_id = (SELECT id FROM selected_branch)
            WHERE id = $3",
        )
        .bind(self.repository_full_name)
        .bind(self.branch_id)
        .bind(self.source_id)
        .bind(self.root_dir)
        .bind(OffsetDateTime::now_utc())
        .execute(conn)
        .await
        .map(|r| r.rows_affected())
        .context("failed to execute query")
    }
}
