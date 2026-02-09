use anyhow::Context;
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Router, middleware};
use eduhost::error::{EndpointResult, error_middleware};
use sqlx::PgPool;
use tokio::net::TcpListener;

mod auth;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let pool = eduhost::database::init_database_pool()
        .await
        .context("failed to init database pool")?;

    let router = Router::new()
        .nest("/auth", auth::routes())
        .route("/", get(index))
        .route("/database", get(database))
        .layer(middleware::from_fn(error_middleware))
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

async fn database(State(pool): State<PgPool>) -> EndpointResult<impl IntoResponse> {
    sqlx::query("SELECT 1 = 1")
        .execute(&pool)
        .await
        .context("failed to exec query")?;

    Ok("Ok\n")
}
