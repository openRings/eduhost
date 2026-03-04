use anyhow::Context;
use sqlx::{FromRow, PgExecutor};
use uuid::Uuid;

#[derive(FromRow)]
pub struct GroupModel {
    pub id: Uuid,
    pub name: String,
    pub teacher_id: Uuid,
    pub teacher_first_name: String,
    pub teacher_last_name: String,
    pub teacher_patronymic: Option<String>,
}

pub struct GroupsByUserQuery {
    pub user_id: Uuid,
}

impl GroupsByUserQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<Vec<GroupModel>>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as::<_, GroupModel>(
            "SELECT g.id, g.name,
            u.id AS teacher_id, u.first_name AS teacher_first_name,
            u.last_name AS teacher_last_name, u.patronymic AS teacher_patronymic
            FROM groups g
            JOIN group_users gu ON gu.group_id = g.id
            JOIN users u ON u.id = g.created_by
            WHERE gu.user_id = $1
            ORDER BY g.created_at DESC",
        )
        .bind(self.user_id)
        .fetch_all(conn)
        .await
        .context("failed to fetch")
    }
}
