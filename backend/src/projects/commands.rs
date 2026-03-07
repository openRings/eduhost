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

impl<'a> ProjectCreateCommand<'a> {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<u64>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query(
            "INSERT INTO projects
            (id, name, alias, owner_id, subject_id, database_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)",
        )
        .bind(self.project_id)
        .bind(self.name)
        .bind(self.alias)
        .bind(self.owner_id)
        .bind(self.subject_id)
        .bind(Option::<Uuid>::None)
        .bind(OffsetDateTime::now_utc())
        .execute(conn)
        .await
        .map(|r| r.rows_affected())
        .context("failed to execute query")
    }
}
