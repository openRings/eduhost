use anyhow::Context;
use axum::http::StatusCode;
use eduhost::error::EndpointResult;
use eduhost::service::Service;
use eduhost::session::AccessLevel;
use sqlx::PgPool;
use uuid::Uuid;

use crate::profile::dtos::GetProfileResponse;
use crate::profile::queries::ProfileQuery;

pub struct ProfileService {
    pool: PgPool,
}

impl ProfileService {
    pub async fn get_profile(
        &self,
        user_id: Uuid,
        access: AccessLevel,
    ) -> EndpointResult<GetProfileResponse> {
        let model = ProfileQuery { user_id }
            .execute(&self.pool)
            .await
            .with_context(|| format!("failed to fetch user profile, user id: {user_id}"))?
            .ok_or(StatusCode::NOT_FOUND)?;

        Ok(GetProfileResponse::from_model(model, access))
    }
}

impl Service for ProfileService {
    fn from_state(pool: PgPool) -> Self {
        Self { pool }
    }
}
