use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Router, middleware};
use axum_cookie::CookieLayer;
use serde_json::json;
use sqlx::PgPool;

use crate::error::error_middleware;
use crate::session::{Session, Student};

pub fn router(pool: PgPool) -> Router {
    Router::new()
        .route("/session", get(session))
        .nest("/auth", crate::auth::routes())
        .nest("/groups", crate::groups::routes())
        .nest("/databases", crate::databases::routes())
        .nest("/projects", crate::projects::routes())
        .nest("/subjects", crate::subjects::routes())
        .nest("/profile", crate::profile::routes())
        .layer(middleware::from_fn(error_middleware))
        .layer(CookieLayer::strict())
        .with_state(pool)
}

async fn session(session: Session<Student>) -> impl IntoResponse {
    json!({
        "userId": session.user_id(),
        "sessionId": session.session_id(),
        "access": session.access()
    })
    .to_string()
}
