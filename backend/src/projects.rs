use axum::extract::Query;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{get, post};
use axum::{Json, Router};
use eduhost::error::EndpointResult;
use eduhost::group_id::GroupId;
use eduhost::normalize::NormalizedJson;
use eduhost::service::WithService;
use eduhost::session::{Session, Student};
use sqlx::PgPool;

use crate::projects::dtos::{
    CreateProjectRequest, GetProjectsQuery, IsProjectAliasAvailableRequest,
};
use crate::projects::service::ProjectsService;

mod commands;
mod dtos;
mod queries;
mod service;

pub fn routes() -> Router<PgPool> {
    Router::new()
        .route("/", get(get_projects))
        .route("/", post(create_project))
        .route("/alias/available", post(is_project_alias_available))
}

async fn get_projects(
    WithService(projects_service): WithService<ProjectsService>,
    group_id: GroupId,
    Query(query): Query<GetProjectsQuery>,
) -> EndpointResult<impl IntoResponse> {
    let user_id = group_id.session().user_id();
    let group_id = group_id.group_id();
    let query_value = query.query;
    let subject_id = query.subject_id;

    let response = projects_service
        .get_projects(user_id, group_id, query_value, subject_id)
        .await?;

    Ok(Json(response))
}

async fn create_project(
    WithService(projects_service): WithService<ProjectsService>,
    session: Session<Student>,
    NormalizedJson(body): NormalizedJson<CreateProjectRequest>,
) -> EndpointResult<impl IntoResponse> {
    let user_id = session.user_id();

    let response = projects_service.create_project(user_id, body).await?;

    Ok((StatusCode::CREATED, Json(response)))
}

async fn is_project_alias_available(
    WithService(projects_service): WithService<ProjectsService>,
    NormalizedJson(body): NormalizedJson<IsProjectAliasAvailableRequest>,
) -> EndpointResult<impl IntoResponse> {
    let response = projects_service.is_project_alias_available(body).await?;

    Ok(Json(response))
}
