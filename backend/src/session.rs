use crate::error::EndpointError;
use anyhow::Context;
use axum::extract::FromRequestParts;
use axum::http::StatusCode;
use axum::http::header::AUTHORIZATION;
use axum::http::request::Parts;
use serde::Serialize;
use sqlx::FromRow;
use sqlx::PgPool;
use std::marker::PhantomData;
use uuid::Uuid;

pub trait AccessLevelMarker {}

pub struct Student;
pub struct Teacher;
pub struct Admin;

impl AccessLevelMarker for Student {}
impl AccessLevelMarker for Teacher {}
impl AccessLevelMarker for Admin {}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, sqlx::Type)]
pub enum AccessLevel {
    Student,
    Teacher,
    Admin,
}

pub struct Session<Level>
where
    Level: AccessLevelMarker,
{
    user_id: Uuid,
    session_id: Uuid,
    access: AccessLevel,
    _level: PhantomData<Level>,
}

impl<Level> Session<Level>
where
    Level: AccessLevelMarker,
{
    fn new(user_id: Uuid, session_id: Uuid, access: AccessLevel) -> Self {
        Self {
            user_id,
            session_id,
            access,
            _level: PhantomData,
        }
    }

    pub fn user_id(&self) -> Uuid {
        self.user_id
    }

    pub fn session_id(&self) -> Uuid {
        self.session_id
    }

    pub fn access(&self) -> AccessLevel {
        self.access
    }
}

trait AccessGuard {
    fn allows(access: AccessLevel) -> bool;
}

impl AccessGuard for Student {
    fn allows(_: AccessLevel) -> bool {
        true
    }
}

impl AccessGuard for Teacher {
    fn allows(access: AccessLevel) -> bool {
        matches!(access, AccessLevel::Teacher | AccessLevel::Admin)
    }
}

impl AccessGuard for Admin {
    fn allows(access: AccessLevel) -> bool {
        matches!(access, AccessLevel::Admin)
    }
}

#[derive(FromRow)]
struct SessionModel {
    session_id: Uuid,
    user_id: Uuid,
    is_admin: bool,
    is_teacher: bool,
}

impl<Level> FromRequestParts<PgPool> for Session<Level>
where
    Level: AccessLevelMarker + AccessGuard,
{
    type Rejection = EndpointError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &PgPool,
    ) -> Result<Self, Self::Rejection> {
        let token = parts
            .headers
            .get(AUTHORIZATION)
            .and_then(|value| value.to_str().ok())
            .and_then(|value| value.strip_prefix("Bearer "))
            .ok_or(EndpointError::Other(StatusCode::UNAUTHORIZED))?;

        let row = sqlx::query_as::<_, SessionModel>(
            "SELECT s.id AS session_id, u.id AS user_id, u.is_admin,
            EXISTS (SELECT 1 FROM teachers t WHERE t.user_id = u.id) AS is_teacher
            FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.access_token = $1 AND s.created_at + s.access_duration > NOW()",
        )
        .bind(token)
        .fetch_optional(state)
        .await
        .context("failed to fetch session")?
        .ok_or(EndpointError::Other(StatusCode::UNAUTHORIZED))?;

        let access = if row.is_admin {
            AccessLevel::Admin
        } else if row.is_teacher {
            AccessLevel::Teacher
        } else {
            AccessLevel::Student
        };

        if !Level::allows(access) {
            return Err(EndpointError::Other(StatusCode::FORBIDDEN));
        }

        Ok(Session::new(row.user_id, row.session_id, access))
    }
}
