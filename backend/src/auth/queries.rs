use anyhow::Context;
use sqlx::FromRow;
use sqlx::PgExecutor;
use uuid::Uuid;

pub struct IsUsernameExistsQuery<'a> {
    pub username: &'a str,
}

#[derive(Debug, Clone, FromRow)]
pub struct UserCredentialsModel {
    pub id: Uuid,
    pub password_hash: String,
}

pub struct UserCredentialsQuery<'a> {
    pub username: &'a str,
}

#[derive(Debug, Clone, FromRow)]
pub struct SessionSummaryModel {
    pub id: Uuid,
    pub user_id: Uuid,
}

pub struct SessionSummaryByRefreshQuery<'a> {
    pub refresh_token: &'a str,
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

impl<'a> SessionSummaryByRefreshQuery<'a> {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<Option<SessionSummaryModel>>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as(
            "SELECT id, user_id FROM sessions
            WHERE refresh_token = $1 AND created_at + refresh_duration > NOW()",
        )
        .bind(self.refresh_token)
        .fetch_optional(conn)
        .await
        .context("failed to fetch")
    }
}
