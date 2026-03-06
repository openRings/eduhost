use axum::extract::Query;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};
use eduhost::error::EndpointResult;
use eduhost::service::WithService;
use eduhost::session::{Session, Student};
use sqlx::PgPool;

use crate::subjects::dtos::GetSubjectsQuery;
use crate::subjects::service::SubjectsService;

mod dtos;
mod queries;
mod service;

pub fn routes() -> Router<PgPool> {
    Router::new().route("/", get(get_subjects))
}

async fn get_subjects(
    WithService(subjects_service): WithService<SubjectsService>,
    session: Session<Student>,
    Query(query): Query<GetSubjectsQuery>,
) -> EndpointResult<impl IntoResponse> {
    let user_id = session.user_id();
    let group_id = query.group_id;

    let response = subjects_service.get_subjects(user_id, group_id).await?;

    Ok(Json(response))
}
