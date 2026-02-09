use axum::Router;
use sqlx::PgPool;

pub fn routes() -> Router<PgPool> {
    Router::new()
}
