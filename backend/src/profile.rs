use crate::error::EndpointResult;
use crate::group_id::GroupId;
use crate::service::WithService;
use crate::session::{Session, Student};
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};
use sqlx::PgPool;

use crate::profile::service::ProfileService;

mod dtos;
mod queries;
mod service;

pub fn routes() -> Router<PgPool> {
    Router::new()
        .route("/", get(get_profile))
        .route("/metrics", get(get_metrics))
}

async fn get_profile(
    WithService(profile_service): WithService<ProfileService>,
    session: Session<Student>,
) -> EndpointResult<impl IntoResponse> {
    let user_id = session.user_id();
    let access = session.access();

    let response = profile_service.get_profile(user_id, access).await?;

    Ok(Json(response))
}

async fn get_metrics(
    WithService(profile_service): WithService<ProfileService>,
    group_id: GroupId,
) -> EndpointResult<impl IntoResponse> {
    let user_id = group_id.session().user_id();
    let group_id = group_id.group_id();

    let response = profile_service.get_metrics(user_id, group_id).await?;

    Ok(Json(response))
}
