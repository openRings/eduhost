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
