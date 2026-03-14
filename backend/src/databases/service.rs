use crate::error::EndpointResult;
use crate::service::Service;
use anyhow::Context;
use sqlx::PgPool;
use uuid::Uuid;

use crate::databases::dtos::GetDatabaseResponse;
use crate::databases::queries::DatabasesByUserQuery;

pub struct DatabasesService {
    pool: PgPool,
}

impl DatabasesService {
    pub async fn get_databases(
        &self,
        user_id: Uuid,
        group_id: Uuid,
    ) -> EndpointResult<Vec<GetDatabaseResponse>> {
        let models = DatabasesByUserQuery { user_id, group_id }
            .execute(&self.pool)
            .await
            .with_context(|| {
                format!("failed to fetch databases, user id: {user_id}, group id: {group_id}")
            })?;

        Ok(models
            .into_iter()
            .map(GetDatabaseResponse::from_model)
            .collect())
    }
}

impl Service for DatabasesService {
    fn from_state(pool: PgPool) -> Self {
        Self { pool }
    }
}
