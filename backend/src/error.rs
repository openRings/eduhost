use axum::body::Body;
use axum::extract::Request;
use axum::http::StatusCode;
use axum::http::header::CONTENT_TYPE;
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use serde_json::json;
use std::borrow::Cow;

pub type EndpointResult<T> = Result<T, EndpointError>;

pub enum EndpointError {
    BadRequest(Cow<'static, str>),
    DeserealizeError(serde_json::Error),
    UnknownContentType,
    Internal(anyhow::Error),
    Other(StatusCode),
}

#[derive(Debug, Clone)]
struct ErrorMessage(String);

impl IntoResponse for EndpointError {
    fn into_response(self) -> Response {
        let builder = Response::builder();

        match self {
            Self::BadRequest(message) => {
                let body = json!({ "message": message }).to_string();

                builder
                    .status(StatusCode::BAD_REQUEST)
                    .header(CONTENT_TYPE, "application/json")
                    .body(Body::new(body))
            }
            Self::UnknownContentType => {
                let body =
                    json!({ "message": "Неизвестный тип контента, ожидается application/json" })
                        .to_string();

                builder
                    .status(StatusCode::UNSUPPORTED_MEDIA_TYPE)
                    .header(CONTENT_TYPE, "application/json")
                    .body(Body::new(body))
            }
            Self::DeserealizeError(error) => {
                let body = json!({ "message": error.to_string() }).to_string();

                builder
                    .status(StatusCode::BAD_REQUEST)
                    .header(CONTENT_TYPE, "application/json")
                    .body(Body::new(body))
            }
            Self::Internal(error) => {
                let body = json!({ "message": "Сервис временно недоступен" }).to_string();

                builder
                    .status(StatusCode::INTERNAL_SERVER_ERROR)
                    .header(CONTENT_TYPE, "application/json")
                    .extension(ErrorMessage(format!("{error:?}")))
                    .body(Body::new(body))
            }
            Self::Other(status) => builder.status(status).body(Body::empty()),
        }
        .expect("response must be build correct")
    }
}

impl From<anyhow::Error> for EndpointError {
    fn from(value: anyhow::Error) -> Self {
        Self::Internal(value)
    }
}

impl From<StatusCode> for EndpointError {
    fn from(value: StatusCode) -> Self {
        Self::Other(value)
    }
}

pub async fn error_middleware(req: Request, next: Next) -> Response {
    let method = req.method().clone();
    let path = req.uri().path().to_owned();

    let resp = next.run(req).await;

    let error_message = resp.extensions().get::<ErrorMessage>();

    if let Some(error_message) = error_message {
        eprintln!("ERROR [{method} {path}]: {}", error_message.0)
    }

    resp
}
