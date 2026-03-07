use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};
use eduhost::error::EndpointResult;
use eduhost::group_id::GroupId;
use eduhost::service::WithService;
use sqlx::PgPool;

use crate::projects::service::ProjectsService;

mod dtos;
mod queries;
mod service;

pub fn routes() -> Router<PgPool> {
    Router::new().route("/", get(get_projects))
}

async fn get_projects(
    WithService(projects_service): WithService<ProjectsService>,
    group_id: GroupId,
) -> EndpointResult<impl IntoResponse> {
    let user_id = group_id.session().user_id();
    let group_id = group_id.group_id();

    let response = projects_service.get_projects(user_id, group_id).await?;

    Ok(Json(response))
}
