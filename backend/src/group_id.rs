use axum::extract::FromRequestParts;
use axum::extract::Query;
use axum::http::request::Parts;
use sqlx::PgPool;
use uuid::Uuid;

use crate::error::EndpointError;
use crate::session::{Session, Student};

pub struct GroupId {
    session: Session<Student>,
    group_id: Uuid,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct GroupIdQuery {
    group_id: Option<String>,
}

impl GroupId {
    pub fn session(&self) -> &Session<Student> {
        &self.session
    }

    pub fn group_id(&self) -> Uuid {
        self.group_id
    }
}

impl FromRequestParts<PgPool> for GroupId {
    type Rejection = EndpointError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &PgPool,
    ) -> Result<Self, Self::Rejection> {
        let session = Session::<Student>::from_request_parts(parts, state).await?;
        let query = Query::<GroupIdQuery>::try_from_uri(&parts.uri).map_err(|_| {
            EndpointError::bad_request_with_error("Не указана группа", "MissingGroup")
        })?;

        let Some(group_id) = query.0.group_id else {
            return Err(EndpointError::bad_request_with_error(
                "Не указана группа",
                "MissingGroup",
            ));
        };

        let group_id = Uuid::parse_str(&group_id).map_err(|_| {
            EndpointError::bad_request_with_error(
                "Некорректный идентификатор группы",
                "MissingGroup",
            )
        })?;

        let user_id = session.user_id();
        let has_group: bool = sqlx::query_scalar(
            "SELECT EXISTS(
                SELECT 1
                FROM groups g
                JOIN group_users gu ON gu.group_id = g.id
                WHERE g.id = $1 AND gu.user_id = $2
            )",
        )
        .bind(group_id)
        .bind(user_id)
        .fetch_one(state)
        .await
        .map_err(anyhow::Error::from)?;

        if !has_group {
            return Err(EndpointError::bad_request_with_error(
                "Группа не найдена или недоступна",
                "MissingGroup",
            ));
        }

        Ok(Self { session, group_id })
    }
}
