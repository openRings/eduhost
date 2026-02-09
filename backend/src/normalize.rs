use axum::body::Bytes;
use axum::extract::{FromRequest, Request};
use axum::http::StatusCode;
use axum::http::header::CONTENT_TYPE;
use serde::de::DeserializeOwned;

use crate::error::EndpointError;

pub trait Normalize
where
    Self: Sized,
{
    fn normalize(self) -> Result<Self, String>;
}

pub struct NormalizedJson<T>(pub T)
where
    T: DeserializeOwned + Normalize;

impl<S, T> FromRequest<S> for NormalizedJson<T>
where
    T: DeserializeOwned + Normalize,
    S: Send + Sync,
{
    type Rejection = EndpointError;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let content_type = req
            .headers()
            .get(CONTENT_TYPE)
            .ok_or(EndpointError::UnknownContentType)?
            .to_str()
            .map_err(|_| EndpointError::UnknownContentType)?;

        if content_type != "application/json" {
            return Err(EndpointError::UnknownContentType);
        }

        let bytes = Bytes::from_request(req, state)
            .await
            .map_err(|_| EndpointError::Other(StatusCode::BAD_REQUEST))?;

        let body =
            serde_json::from_reader::<_, T>(&*bytes).map_err(EndpointError::DeserealizeError)?;

        let normalized_body = body
            .normalize()
            .map_err(|m| EndpointError::BadRequest(m.into()))?;

        Ok(Self(normalized_body))
    }
}
