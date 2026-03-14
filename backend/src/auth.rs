use crate::error::EndpointResult;
use crate::normalize::NormalizedJson;
use crate::service::WithService;
use crate::session::{Session, Student};
use axum::Json;
use axum::Router;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::post;
use axum_cookie::CookieManager;
use sqlx::PgPool;

use self::dtos::{IsUsernameAvailableRequest, SigninRequest, SignupRequest};
use self::service::AuthService;

mod commands;
mod dtos;
mod queries;
mod service;

pub fn routes() -> Router<PgPool> {
    Router::new()
        .route("/signup", post(signup))
        .route("/signin", post(signin))
        .route("/username/available", post(is_username_available))
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

async fn is_username_available(
    WithService(auth_service): WithService<AuthService>,
    NormalizedJson(body): NormalizedJson<IsUsernameAvailableRequest>,
) -> EndpointResult<impl IntoResponse> {
    let response = auth_service.is_username_available(body).await?;

    Ok(Json(response))
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
