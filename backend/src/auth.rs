use axum::Router;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::post;
use eduhost::error::EndpointResult;
use eduhost::normalize::NormalizedJson;
use eduhost::service::WithService;
use sqlx::PgPool;

use self::dtos::SignupRequest;
use self::service::AuthService;

mod commands;
mod dtos;
mod queries;
mod service;

pub fn routes() -> Router<PgPool> {
    Router::new().route("/signup", post(signup))
}

async fn signup(
    WithService(auth_service): WithService<AuthService>,
    NormalizedJson(body): NormalizedJson<SignupRequest>,
) -> EndpointResult<impl IntoResponse> {
    auth_service.create_user(body).await?;

    Ok(StatusCode::CREATED)
}
