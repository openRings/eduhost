use anyhow::Context;
use eduhost::crypto::hash_password;
use eduhost::error::{EndpointError, EndpointResult};
use eduhost::service::Service;
use sqlx::PgPool;

use crate::auth::commands::UserCreateCommand;
use crate::auth::dtos::SignupRequest;
use crate::auth::queries::IsUsernameExistsQuery;

pub struct AuthService {
    pool: PgPool,
}

impl AuthService {
    pub async fn create_user(&self, body: SignupRequest) -> EndpointResult<()> {
        let SignupRequest { username, .. } = &body;

        let is_username_exists = IsUsernameExistsQuery { username }
            .execute(&self.pool)
            .await
            .with_context(|| format!("failed to check is username exists: {username}"))?;

        if is_username_exists {
            return Err(EndpointError::bad_request(
                "Юзернейм занят другим пользователем",
            ));
        }

        let SignupRequest {
            username,
            first_name,
            last_name,
            patronymic,
            password,
            ..
        } = &body;

        let password_hash = hash_password(password);

        UserCreateCommand {
            username,
            first_name,
            last_name,
            patronymic: patronymic.as_deref(),
            password_hash: &password_hash,
        }
        .execute(&self.pool)
        .await
        .with_context(|| format!("failed to create user, username: {username}"))?;

        Ok(())
    }
}

impl Service for AuthService {
    fn from_state(pool: PgPool) -> Self {
        Self { pool }
    }
}
