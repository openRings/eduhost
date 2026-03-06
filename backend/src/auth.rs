use axum::Router;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::post;
use axum_cookie::CookieManager;
use eduhost::error::EndpointResult;
use eduhost::normalize::NormalizedJson;
use eduhost::service::WithService;
use eduhost::session::{Session, Student};
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
        .route("/refresh", post(refresh))
        .route("/logout", post(logout))
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

async fn refresh(
    WithService(auth_service): WithService<AuthService>,
    cookie: CookieManager,
) -> EndpointResult<impl IntoResponse> {
    let refresh_cookie = cookie
        .get("refresh-token")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let refresh_token = refresh_cookie.value();

    let response = auth_service.refresh(refresh_token).await?;

    Ok(response)
}

async fn logout(
    WithService(auth_service): WithService<AuthService>,
    session: Session<Student>,
) -> EndpointResult<impl IntoResponse> {
    let session_id = session.session_id();

    auth_service.logout(session_id).await?;

    Ok(StatusCode::NO_CONTENT)
}
