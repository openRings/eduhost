use eduhost::error::EndpointResult;
use eduhost::service::Service;
use sqlx::PgPool;

use crate::auth::dtos::SignupRequest;

pub struct AuthService {
    pool: PgPool,
}

impl AuthService {
    pub async fn create_user(&self, body: SignupRequest) -> EndpointResult<()> {
        println!("create user called");

        Ok(())
    }
}

impl Service for AuthService {
    fn from_state(pool: PgPool) -> Self {
        Self { pool }
    }
}
