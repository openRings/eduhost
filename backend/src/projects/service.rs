use anyhow::Context;
use eduhost::error::EndpointResult;
use eduhost::service::Service;
use sqlx::PgPool;
use uuid::Uuid;

use crate::projects::dtos::SubjectProjectsResponse;
use crate::projects::queries::SubjectProjectsByUserQuery;

pub struct ProjectsService {
    pool: PgPool,
}

impl ProjectsService {
    pub async fn get_projects(
        &self,
        user_id: Uuid,
        group_id: Uuid,
    ) -> EndpointResult<Vec<SubjectProjectsResponse>> {
        let models = SubjectProjectsByUserQuery { user_id, group_id }
            .execute(&self.pool)
            .await
            .with_context(|| {
                format!("failed to fetch projects, user id: {user_id}, group id: {group_id}")
            })?;

        Ok(SubjectProjectsResponse::from_models(models))
    }
}

impl Service for ProjectsService {
    fn from_state(pool: PgPool) -> Self {
        Self { pool }
    }
}
