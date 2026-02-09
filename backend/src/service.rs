use axum::extract::FromRequestParts;
use axum::http::request::Parts;
use sqlx::PgPool;
use std::ops::Deref;

pub trait Service {
    fn from_state(state: PgPool) -> Self;
}

pub struct WithService<T>(pub T)
where
    T: Service;

impl<T> FromRequestParts<PgPool> for WithService<T>
where
    T: Service,
{
    type Rejection = ();

    async fn from_request_parts(
        _parts: &mut Parts,
        state: &PgPool,
    ) -> Result<Self, Self::Rejection> {
        Ok(WithService(T::from_state(state.clone())))
    }
}

impl<T> Deref for WithService<T>
where
    T: Service,
{
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
