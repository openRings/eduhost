use axum::Router;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::post;
use eduhost::error::EndpointResult;
use eduhost::normalize::NormalizedJson;
use eduhost::service::WithService;
use sqlx::PgPool;

use self::dtos::{SigninRequest, SignupRequest};
use self::service::AuthService;

mod commands;
mod dtos;
mod queries;
mod service;

pub fn routes() -> Router<PgPool> {
    Router::new()
        .route("/signup", post(signup))
        .route("/signin", post(signin))
}

async fn signup(
    WithService(auth_service): WithService<AuthService>,
    NormalizedJson(body): NormalizedJson<SignupRequest>,
) -> EndpointResult<impl IntoResponse> {
    auth_service.create_user(body).await?;

    Ok(StatusCode::CREATED)
}

async fn signin(
    WithService(auth_service): WithService<AuthService>,
    NormalizedJson(body): NormalizedJson<SigninRequest>,
) -> EndpointResult<impl IntoResponse> {
    let response = auth_service.signin(body).await?;

    Ok(response)
}
