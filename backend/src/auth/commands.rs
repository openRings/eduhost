use anyhow::Context;
use sqlx::PgExecutor;
use time::{Duration, OffsetDateTime};
use uuid::Uuid;

pub struct UserCreateCommand<'a> {
    pub username: &'a str,
    pub first_name: &'a str,
    pub last_name: &'a str,
    pub patronymic: Option<&'a str>,
    pub password_hash: &'a str,
}

pub struct SessionCreateCommand<'a> {
    pub user_id: Uuid,
    pub access_token: &'a str,
    pub refresh_token: &'a str,
    pub access_duration: Duration,
    pub refresh_duration: Duration,
}

pub struct SessionExpireCommand {
    pub session_id: Uuid,
}

impl<'a> UserCreateCommand<'a> {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<u64>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query(
            "INSERT INTO users
            (id, username, first_name, last_name, patronymic, is_admin, password_hash, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        )
        .bind(Uuid::now_v7())
        .bind(self.username)
        .bind(self.first_name)
        .bind(self.last_name)
        .bind(self.patronymic)
        .bind(false)
        .bind(self.password_hash)
        .bind(OffsetDateTime::now_utc())
        .execute(conn)
        .await
        .map(|r| r.rows_affected())
        .context("failed to execute query")
    }
}

impl<'a> SessionCreateCommand<'a> {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<u64>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query(
            "INSERT INTO sessions
            (id, user_id, access_token, refresh_token, access_duration, refresh_duration, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)",
        )
        .bind(Uuid::now_v7())
        .bind(self.user_id)
        .bind(self.access_token)
        .bind(self.refresh_token)
        .bind(self.access_duration)
        .bind(self.refresh_duration)
        .bind(OffsetDateTime::now_utc())
        .execute(conn)
        .await
        .map(|r| r.rows_affected())
        .context("failed to execute query")
    }
}

impl SessionExpireCommand {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<u64>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query("DELETE FROM sessions WHERE id = $1")
            .bind(self.session_id)
            .execute(conn)
            .await
            .map(|r| r.rows_affected())
            .context("failed to execute query")
    }
}
