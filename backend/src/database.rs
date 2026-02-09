use anyhow::Context;
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use std::env;

pub async fn init_database_pool() -> anyhow::Result<PgPool> {
    let addr = env::var("DATABASE_ADDR").context("missing `DATABASE_ADDR` env var")?;
    let name = env::var("DATABASE_NAME").context("missing `DATABASE_NAME` env var")?;
    let user = env::var("DATABASE_USER").context("missing `DATABASE_USER` env var")?;
    let pass = sealed_env::var("DATABASE_PASS").context("missing `DATABASE_PASS` env var")?;

    let url = format!("postgres://{user}:{pass}@{addr}/{name}");

    PgPoolOptions::new()
        .max_connections(20)
        .min_connections(1)
        .test_before_acquire(false)
        .connect(&url)
        .await
        .context("failed to connect")
}
