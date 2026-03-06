use anyhow::Context;
use sqlx::{FromRow, PgExecutor};
use uuid::Uuid;

#[derive(FromRow)]
pub struct ProfileModel {
    pub username: String,
    pub first_name: String,
    pub last_name: String,
    pub patronymic: Option<String>,
}

pub struct ProfileQuery {
    pub user_id: Uuid,
}

#[derive(FromRow)]
pub struct AccountMetricsModel {
    pub disk_used_bytes: i64,
    pub disk_available_bytes: i64,
    pub project_count: i64,
    pub subject_count: i64,
}

pub struct AccountMetricsQuery {
    pub user_id: Uuid,
    pub group_id: Uuid,
}

impl ProfileQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<Option<ProfileModel>>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as::<_, ProfileModel>(
            "SELECT username, first_name, last_name, patronymic FROM users
            WHERE id = $1",
        )
        .bind(self.user_id)
        .fetch_optional(conn)
        .await
        .context("failed to fetch")
    }
}

impl AccountMetricsQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<AccountMetricsModel>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as::<_, AccountMetricsModel>(
            "SELECT
                COALESCE((
                    SELECT SUM(ps.size_bytes)::BIGINT
                    FROM projects p
                    JOIN project_sources ps ON ps.id = p.source_id
                    WHERE p.owner_id = $1
                ), 0)
                +
                COALESCE((
                    SELECT SUM(d.disk_usage_bytes)::BIGINT
                    FROM databases d
                    WHERE d.owner_id = $1
                ), 0) AS disk_used_bytes,
                COALESCE((
                    SELECT SUM(s.reserved_disk_bytes)::BIGINT
                    FROM subjects s
                    JOIN subject_groups sg ON sg.subject_id = s.id
                    JOIN group_users gu ON gu.group_id = sg.group_id
                    WHERE gu.user_id = $1 AND gu.group_id = $2
                ), 0) AS disk_available_bytes,
                (SELECT COUNT(*) FROM projects p WHERE p.owner_id = $1) AS project_count,
                (SELECT COUNT(DISTINCT s.id)
                FROM subjects s
                JOIN subject_groups sg ON sg.subject_id = s.id
                JOIN group_users gu ON gu.group_id = sg.group_id
                WHERE gu.user_id = $1 AND gu.group_id = $2) AS subject_count",
        )
        .bind(self.user_id)
        .bind(self.group_id)
        .fetch_one(conn)
        .await
        .context("failed to fetch")
    }
}
