use anyhow::Context;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Router, middleware};
use axum_cookie::CookieLayer;
use eduhost::error::error_middleware;
use eduhost::session::{Session, Student};
use serde_json::json;
use std::process;
use tokio::net::TcpListener;
use tracing_loki::url::Url;
use tracing_subscriber::EnvFilter;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

mod auth;
mod profile;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let (layer, task) = tracing_loki::builder()
        .extra_field("pid", format!("{}", process::id()))?
        .build_url(Url::parse("http://loki:3100").unwrap())?;

    tracing_subscriber::registry()
        .with(EnvFilter::new("eduhost=info"))
        .with(layer)
        .init();

    tracing::info!("backend starting..");
    tokio::spawn(task);

    let pool = eduhost::database::init_database_pool()
        .await
        .context("failed to init database pool")?;

    let router = Router::new()
        .route("/session", get(session))
        .nest("/auth", auth::routes())
        .nest("/profile", profile::routes())
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

// TODO: remove that
async fn session(session: Session<Student>) -> impl IntoResponse {
    json!({
        "userId": session.user_id(),
        "sessionId": session.session_id(),
        "access": session.access()
    })
    .to_string()
}
