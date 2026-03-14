use crate::error::EndpointResult;
use crate::group_id::GroupId;
use crate::service::WithService;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};
use sqlx::PgPool;

use crate::databases::service::DatabasesService;

mod dtos;
mod queries;
mod service;

pub fn routes() -> Router<PgPool> {
    Router::new().route("/", get(get_databases))
}

async fn get_databases(
    WithService(databases_service): WithService<DatabasesService>,
    group_id: GroupId,
) -> EndpointResult<impl IntoResponse> {
    let user_id = group_id.session().user_id();
    let group_id = group_id.group_id();

    let response = databases_service.get_databases(user_id, group_id).await?;

    Ok(Json(response))
}
