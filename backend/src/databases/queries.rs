use anyhow::Context;
use sqlx::{FromRow, PgExecutor};
use time::OffsetDateTime;
use uuid::Uuid;

#[derive(Debug, Clone, FromRow)]
pub struct DatabaseByUserModel {
    pub name: String,
    pub disk_usage_bytes: i64,
    pub created_at: OffsetDateTime,
    pub project_id: Uuid,
}

pub struct DatabasesByUserQuery {
    pub user_id: Uuid,
    pub group_id: Uuid,
}

impl DatabasesByUserQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<Vec<DatabaseByUserModel>>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as::<_, DatabaseByUserModel>(
            "SELECT
                d.name,
                COALESCE(d.disk_usage_bytes, 0) AS disk_usage_bytes,
                d.created_at,
                d.project_id
            FROM databases d
            JOIN projects p ON p.id = d.project_id
            JOIN subjects s ON s.id = p.subject_id
            JOIN subject_groups sg ON sg.subject_id = s.id
            JOIN group_users gu ON gu.group_id = sg.group_id
            WHERE gu.user_id = $1
            AND gu.group_id = $2
            ORDER BY d.created_at DESC, p.created_at DESC",
        )
        .bind(self.user_id)
        .bind(self.group_id)
        .fetch_all(conn)
        .await
        .context("failed to fetch")
    }
}
