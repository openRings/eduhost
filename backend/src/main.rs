use anyhow::Context;
use axum::Router;
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::get;
use sqlx::PgPool;
use tokio::net::TcpListener;

mod database;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let pool = database::init_database_pool()
        .await
        .context("failed to init database pool")?;

    let router = Router::new()
        .route("/", get(index))
        .route("/database", get(database))
        .with_state(pool);

    let listener = TcpListener::bind("0.0.0.0:80")
        .await
        .context("failed to bind addr")?;

    axum::serve(listener, router)
        .await
        .context("failed to serve")?;

    Ok(())
}

async fn index() -> impl IntoResponse {
    "Ok\n"
}

async fn database(State(pool): State<PgPool>) -> Result<impl IntoResponse, (StatusCode, String)> {
    sqlx::query("SELECT 1 = 1")
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok("Ok\n")
}
