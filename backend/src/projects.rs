use crate::error::EndpointResult;
use crate::group_id::GroupId;
use crate::normalize::NormalizedJson;
use crate::service::WithService;
use crate::session::{Session, Student};
use axum::extract::Path;
use axum::extract::Query;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::routing::{get, post};
use axum::{Json, Router};
use sqlx::PgPool;
use uuid::Uuid;

use crate::projects::dtos::{
    CreateProjectRequest, GetProjectsQuery, IsProjectAliasAvailableRequest, ProjectSourceRequest,
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
        .route("/{project_id}", get(get_project))
        .route("/{project_id}/source", post(set_project_source))
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

async fn get_project(
    WithService(projects_service): WithService<ProjectsService>,
    session: Session<Student>,
    Path(project_id): Path<Uuid>,
) -> EndpointResult<impl IntoResponse> {
    let user_id = session.user_id();

    let response = projects_service.get_project(user_id, project_id).await?;

    Ok(Json(response))
}

async fn is_project_alias_available(
    WithService(projects_service): WithService<ProjectsService>,
    NormalizedJson(body): NormalizedJson<IsProjectAliasAvailableRequest>,
) -> EndpointResult<impl IntoResponse> {
    let response = projects_service.is_project_alias_available(body).await?;

    Ok(Json(response))
}

async fn set_project_source(
    WithService(projects_service): WithService<ProjectsService>,
    session: Session<Student>,
    Path(project_id): Path<Uuid>,
    NormalizedJson(body): NormalizedJson<ProjectSourceRequest>,
) -> EndpointResult<impl IntoResponse> {
    let user_id = session.user_id();

    projects_service
        .set_project_source(user_id, project_id, body)
        .await?;

    Ok(StatusCode::NO_CONTENT)
}
