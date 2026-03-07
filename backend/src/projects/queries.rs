use anyhow::Context;
use sqlx::{FromRow, PgExecutor};
use uuid::Uuid;

#[derive(Debug, Clone, FromRow)]
pub struct SubjectProjectModel {
    pub subject_id: Uuid,
    pub subject_name: String,
    pub subject_reserved_disk_bytes: i64,
    pub teacher_id: Uuid,
    pub teacher_first_name: String,
    pub teacher_last_name: String,
    pub teacher_patronymic: Option<String>,
    pub project_id: Option<Uuid>,
    pub project_name: Option<String>,
    pub project_alias: Option<String>,
    pub project_file_usage_bytes: i64,
    pub project_database_usage_bytes: i64,
}

pub struct SubjectProjectsByUserQuery {
    pub user_id: Uuid,
    pub group_id: Uuid,
}

impl SubjectProjectsByUserQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<Vec<SubjectProjectModel>>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as::<_, SubjectProjectModel>(
            "SELECT
                s.id AS subject_id,
                s.name AS subject_name,
                s.reserved_disk_bytes AS subject_reserved_disk_bytes,
                u.id AS teacher_id,
                u.first_name AS teacher_first_name,
                u.last_name AS teacher_last_name,
                u.patronymic AS teacher_patronymic,
                p.id AS project_id,
                p.name AS project_name,
                p.alias AS project_alias,
                COALESCE(ps.size_bytes, 0) AS project_file_usage_bytes,
                COALESCE(d.disk_usage_bytes, 0) AS project_database_usage_bytes
            FROM subjects s
            JOIN subject_groups sg ON sg.subject_id = s.id
            JOIN group_users gu ON gu.group_id = sg.group_id
            JOIN users u ON u.id = s.owner_id
            LEFT JOIN projects p ON p.subject_id = s.id
            LEFT JOIN project_sources ps ON ps.id = p.source_id
            LEFT JOIN databases d ON d.id = p.database_id
            WHERE gu.user_id = $1 AND gu.group_id = $2
            ORDER BY s.created_at DESC, p.created_at DESC",
        )
        .bind(self.user_id)
        .bind(self.group_id)
        .fetch_all(conn)
        .await
        .context("failed to fetch")
    }
}
