use crate::error::EndpointResult;
use crate::service::WithService;
use crate::session::{Session, Student};
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};
use sqlx::PgPool;

use crate::groups::service::GroupsService;

mod dtos;
pub(crate) mod queries;
mod service;

pub fn routes() -> Router<PgPool> {
    Router::new().route("/", get(get_groups))
}

async fn get_groups(
    WithService(groups_service): WithService<GroupsService>,
    session: Session<Student>,
) -> EndpointResult<impl IntoResponse> {
    let user_id = session.user_id();

    let response = groups_service.get_groups(user_id).await?;

    Ok(Json(response))
}
