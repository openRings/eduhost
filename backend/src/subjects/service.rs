use anyhow::Context;
use eduhost::error::EndpointError;
use eduhost::error::EndpointResult;
use eduhost::service::Service;
use sqlx::PgPool;
use uuid::Uuid;

use crate::groups::queries::IsGroupAvailableForUserQuery;
use crate::subjects::dtos::GetSubjectResponse;
use crate::subjects::queries::SubjectsByUserQuery;

pub struct SubjectsService {
    pool: PgPool,
}

impl SubjectsService {
    pub async fn get_subjects(
        &self,
        user_id: Uuid,
        group_id: Uuid,
    ) -> EndpointResult<Vec<GetSubjectResponse>> {
        let has_group = IsGroupAvailableForUserQuery { user_id, group_id }
            .execute(&self.pool)
            .await
            .with_context(|| {
                format!(
                    "failed to check group availability, user id: {user_id}, group id: {group_id}"
                )
            })?;

        if !has_group {
            return Err(EndpointError::bad_request_with_error(
                "Группа не найдена или недоступна для студента",
                "MissingGroup",
            ));
        }

        let models = SubjectsByUserQuery { user_id, group_id }
            .execute(&self.pool)
            .await
            .with_context(|| {
                format!("failed to fetch subjects, user id: {user_id}, group id: {group_id}")
            })?;

        Ok(models
            .into_iter()
            .map(GetSubjectResponse::from_model)
            .collect())
    }
}

impl Service for SubjectsService {
    fn from_state(pool: PgPool) -> Self {
        Self { pool }
    }
}
