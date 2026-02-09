use anyhow::Context;
use axum::{Router, middleware};
use axum_cookie::CookieLayer;
use eduhost::error::error_middleware;
use tokio::net::TcpListener;

mod auth;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let pool = eduhost::database::init_database_pool()
        .await
        .context("failed to init database pool")?;

    let router = Router::new()
        .nest("/auth", auth::routes())
        .layer(middleware::from_fn(error_middleware))
        .layer(CookieLayer::strict())
        .with_state(pool);

    let listener = TcpListener::bind("0.0.0.0:80")
        .await
        .context("failed to bind addr")?;

    axum::serve(listener, router)
        .await
        .context("failed to serve")?;

    Ok(())
}
