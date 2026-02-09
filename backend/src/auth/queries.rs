use anyhow::Context;
use sqlx::FromRow;
use sqlx::PgExecutor;
use uuid::Uuid;

pub struct IsUsernameExistsQuery<'a> {
    pub username: &'a str,
}

impl<'a> IsUsernameExistsQuery<'a> {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<bool>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_scalar("SELECT EXISTS (SELECT 1 FROM users WHERE username = $1)")
            .bind(self.username)
            .fetch_one(conn)
            .await
            .context("failed to fetch")
    }
}

#[derive(Debug, Clone, FromRow)]
pub struct UserCredentialsModel {
    pub id: Uuid,
    pub password_hash: String,
}

pub struct UserCredentialsQuery<'a> {
    pub username: &'a str,
}

impl<'a> UserCredentialsQuery<'a> {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<Option<UserCredentialsModel>>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as("SELECT id, password_hash FROM users WHERE username = $1")
            .bind(self.username)
            .fetch_optional(conn)
            .await
            .context("failed to fetch")
    }
}
