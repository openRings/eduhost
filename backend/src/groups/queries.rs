use anyhow::Context;
use sqlx::{FromRow, PgExecutor};
use uuid::Uuid;

#[derive(FromRow)]
pub struct GroupModel {
    pub id: Uuid,
    pub name: String,
}

pub struct GroupsByUserQuery {
    pub user_id: Uuid,
}

pub struct IsGroupAvailableForUserQuery {
    pub user_id: Uuid,
    pub group_id: Uuid,
}

impl GroupsByUserQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<Vec<GroupModel>>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as::<_, GroupModel>(
            "SELECT DISTINCT g.id, g.name
            FROM groups g
            JOIN group_users gu ON gu.group_id = g.id
            WHERE gu.user_id = $1
            ORDER BY g.name",
        )
        .bind(self.user_id)
        .fetch_all(conn)
        .await
        .context("failed to fetch")
    }
}

impl IsGroupAvailableForUserQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<bool>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_scalar(
            "SELECT EXISTS(
                SELECT 1
                FROM groups g
                JOIN group_users gu ON gu.group_id = g.id
                WHERE g.id = $1 AND gu.user_id = $2
            )",
        )
        .bind(self.group_id)
        .bind(self.user_id)
        .fetch_one(conn)
        .await
        .context("failed to check is group available for user")
    }
}
