use anyhow::Context;
use eduhost::error::EndpointResult;
use eduhost::service::Service;
use sqlx::PgPool;
use uuid::Uuid;

use crate::groups::dtos::GetGroupResponse;
use crate::groups::queries::GroupsByUserQuery;

pub struct GroupsService {
    pool: PgPool,
}

impl GroupsService {
    pub async fn get_groups(&self, user_id: Uuid) -> EndpointResult<Vec<GetGroupResponse>> {
        let models = GroupsByUserQuery { user_id }
            .execute(&self.pool)
            .await
            .with_context(|| format!("failed to fetch groups, user id: {user_id}"))?;

        Ok(models
            .into_iter()
            .map(GetGroupResponse::from_model)
            .collect())
    }
}

impl Service for GroupsService {
    fn from_state(pool: PgPool) -> Self {
        Self { pool }
    }
}
