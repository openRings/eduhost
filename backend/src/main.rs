use anyhow::Context;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Router, middleware};
use axum_cookie::CookieLayer;
use eduhost::error::error_middleware;
use eduhost::session::{Session, Student};
use serde_json::json;
use tokio::net::TcpListener;

mod auth;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let pool = eduhost::database::init_database_pool()
        .await
        .context("failed to init database pool")?;

    let router = Router::new()
        .route("/session", get(session))
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

async fn session(session: Session<Student>) -> impl IntoResponse {
    json!({
        "userId": session.user_id(),
        "sessionId": session.session_id(),
        "access": session.access()
    })
    .to_string()
}
