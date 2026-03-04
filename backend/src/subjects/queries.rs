use anyhow::Context;
use sqlx::{FromRow, PgExecutor};
use uuid::Uuid;

#[derive(FromRow)]
pub struct SubjectModel {
    pub id: Uuid,
    pub name: String,
    pub reserved_disk_bytes: i64,
    pub teacher_id: Uuid,
    pub teacher_first_name: String,
    pub teacher_last_name: String,
    pub teacher_patronymic: Option<String>,
}

pub struct SubjectsByUserQuery {
    pub user_id: Uuid,
}

impl SubjectsByUserQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<Vec<SubjectModel>>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as::<_, SubjectModel>(
            "SELECT s.id, s.name, s.reserved_disk_bytes,
            u.id AS teacher_id, u.first_name AS teacher_first_name,
            u.last_name AS teacher_last_name, u.patronymic AS teacher_patronymic
            FROM subjects s
            JOIN subject_groups sg ON sg.subject_id = s.id
            JOIN group_users gu ON gu.group_id = sg.group_id
            JOIN users u ON u.id = s.owner_id
            WHERE gu.user_id = $1
            GROUP BY s.id, s.name, s.reserved_disk_bytes,
            u.id, u.first_name, u.last_name, u.patronymic
            ORDER BY s.created_at DESC",
        )
        .bind(self.user_id)
        .fetch_all(conn)
        .await
        .context("failed to fetch")
    }
}
