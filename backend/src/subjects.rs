use axum::extract::Query;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};
use eduhost::error::EndpointError;
use eduhost::error::EndpointResult;
use eduhost::service::WithService;
use eduhost::session::{Session, Student};
use sqlx::PgPool;
use uuid::Uuid;

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
    let group_id = parse_group_id(query.group_id)?;

    let response = subjects_service.get_subjects(user_id, group_id).await?;

    Ok(Json(response))
}

fn parse_group_id(group_id: Option<String>) -> EndpointResult<Uuid> {
    let Some(group_id) = group_id else {
        return Err(EndpointError::bad_request_with_error(
            "Не указана группа",
            "MissingGroup",
        ));
    };

    Uuid::parse_str(&group_id).map_err(|_| {
        EndpointError::bad_request_with_error("Некорректный идентификатор группы", "MissingGroup")
    })
}
