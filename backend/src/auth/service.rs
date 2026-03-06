use anyhow::Context;
use axum::http::StatusCode;
use base64::Engine;
use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use eduhost::crypto::{hash_password, verify_password};
use eduhost::error::{EndpointError, EndpointResult};
use eduhost::service::Service;
use rand::RngExt;
use sqlx::PgPool;
use time::Duration;
use uuid::Uuid;

use crate::auth::commands::{SessionCreateCommand, SessionExpireCommand, UserCreateCommand};
use crate::auth::dtos::{
    IsUsernameAvailableRequest, IsUsernameAvailableResponse, NewSessionResponse, SigninRequest,
    SignupRequest,
};
use crate::auth::queries::{
    IsUsernameExistsQuery, SessionSummaryByRefreshQuery, UserCredentialsQuery,
};

pub struct AuthService {
    pool: PgPool,
}

impl AuthService {
    pub async fn is_username_available(
        &self,
        body: IsUsernameAvailableRequest,
    ) -> EndpointResult<IsUsernameAvailableResponse> {
        let IsUsernameAvailableRequest { username } = body;

        let is_username_exists = IsUsernameExistsQuery {
            username: &username,
        }
        .execute(&self.pool)
        .await
        .with_context(|| format!("failed to check is username exists: {username}"))?;

        Ok(IsUsernameAvailableResponse {
            is_available: !is_username_exists,
        })
    }

    pub async fn create_user(&self, body: SignupRequest) -> EndpointResult<()> {
        let SignupRequest { username, .. } = &body;

        let is_username_exists = IsUsernameExistsQuery { username }
            .execute(&self.pool)
            .await
            .with_context(|| format!("failed to check is username exists: {username}"))?;

        if is_username_exists {
            tracing::warn!(%username, "user try to create account with exists username");

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

        tracing::info!(%username, "created new user");

        Ok(())
    }

    pub async fn refresh(&self, refresh_token: &str) -> EndpointResult<NewSessionResponse> {
        let session_summary = SessionSummaryByRefreshQuery { refresh_token }
            .execute(&self.pool)
            .await
            .with_context(|| format!("failed to get session summary: {}..", &refresh_token[..8]))?
            .ok_or_else(|| {
                tracing::warn!(refresh_token = %refresh_token[..8], "user try to unknown session");

                StatusCode::UNAUTHORIZED
            })?;

        let session_expired = SessionExpireCommand {
            session_id: session_summary.id,
        }
        .execute(&self.pool)
        .await
        .with_context(|| {
            format!(
                "failed to delete session before refresh, user: {} refresh_token: {}..",
                session_summary.user_id,
                &refresh_token[..8]
            )
        })?;

        if session_expired != 1 {
            return Err(StatusCode::UNAUTHORIZED.into());
        }

        let (access_token, refresh_token) = generate_tokens();
        let access_duration = Duration::minutes(10);
        let refresh_duration = Duration::days(31);

        SessionCreateCommand {
            user_id: session_summary.user_id,
            access_token: &access_token,
            refresh_token: &refresh_token,
            access_duration,
            refresh_duration,
        }
        .execute(&self.pool)
        .await
        .with_context(|| {
            format!(
                "failed to create session while refresh for user: {}",
                session_summary.user_id
            )
        })?;

        Ok(NewSessionResponse {
            access_token,
            refresh_token,
        })
    }

    pub async fn signin(&self, body: SigninRequest) -> EndpointResult<NewSessionResponse> {
        let SigninRequest { username, password } = &body;

        let credentials = UserCredentialsQuery { username }
            .execute(&self.pool)
            .await
            .with_context(|| format!("failed to fetch user credentials: {username}"))?
            .ok_or(StatusCode::FORBIDDEN)?;

        if !verify_password(password, &credentials.password_hash) {
            tracing::warn!(%username, "user try to signin with wrong password");

            return Err(StatusCode::FORBIDDEN.into());
        }

        let (access_token, refresh_token) = generate_tokens();
        let access_duration = Duration::minutes(10);
        let refresh_duration = Duration::days(31);

        SessionCreateCommand {
            user_id: credentials.id,
            access_token: &access_token,
            refresh_token: &refresh_token,
            access_duration,
            refresh_duration,
        }
        .execute(&self.pool)
        .await
        .with_context(|| format!("failed to create session: {username}"))?;

        Ok(NewSessionResponse {
            access_token,
            refresh_token,
        })
    }

    pub async fn logout(&self, session_id: Uuid) -> EndpointResult<()> {
        let session_expired = SessionExpireCommand { session_id }
            .execute(&self.pool)
            .await
            .with_context(|| {
                format!("failed to delete session by logout, session id: {session_id}")
            })?;

        if session_expired != 1 {
            return Err(StatusCode::UNAUTHORIZED.into());
        }

        Ok(())
    }
}

impl Service for AuthService {
    fn from_state(pool: PgPool) -> Self {
        Self { pool }
    }
}

fn generate_tokens() -> (String, String) {
    let mut rng = rand::rng();

    let mut access = [0u8; 32];
    let mut refresh = [0u8; 32];

    rng.fill(&mut access);
    rng.fill(&mut refresh);

    let access_token = URL_SAFE_NO_PAD.encode(access);
    let refresh_token = URL_SAFE_NO_PAD.encode(refresh);

    (access_token, refresh_token)
}
