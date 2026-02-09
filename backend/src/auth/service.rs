use anyhow::Context;
use axum::http::StatusCode;
use axum_cookie::prelude::CookieManager;
use base64::Engine;
use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use eduhost::crypto::{hash_password, verify_password};
use eduhost::error::{EndpointError, EndpointResult};
use eduhost::service::Service;
use rand::RngExt;
use sqlx::PgPool;
use time::Duration;

use crate::auth::commands::{SessionCreateCommand, UserCreateCommand};
use crate::auth::dtos::{SigninRequest, SigninResponse, SignupRequest};
use crate::auth::queries::{IsUsernameExistsQuery, UserCredentialsQuery};

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

    pub async fn signin(
        &self,
        body: SigninRequest,
        cookie: CookieManager,
    ) -> EndpointResult<SigninResponse> {
        let SigninRequest { username, password } = &body;

        let credentials = UserCredentialsQuery { username }
            .execute(&self.pool)
            .await
            .with_context(|| format!("failed to fetch user credentials: {username}"))?
            .ok_or(StatusCode::FORBIDDEN)?;

        if !verify_password(password, &credentials.password_hash) {
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

        Ok(SigninResponse {
            access_token,
            refresh_token,
            cookies: cookie,
        })
    }
}

impl Service for AuthService {
    fn from_state(pool: PgPool) -> Self {
        Self { pool }
    }
}

fn generate_tokens() -> (String, String) {
    let mut rng = rand::rng();
    let mut access = [0u8; 128];
    let mut refresh = [0u8; 128];

    rng.fill(&mut access);
    rng.fill(&mut refresh);

    let access_token = URL_SAFE_NO_PAD.encode(access);
    let refresh_token = URL_SAFE_NO_PAD.encode(refresh);

    (access_token, refresh_token)
}
