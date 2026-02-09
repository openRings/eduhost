use anyhow::Context;
use sqlx::PgExecutor;

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
