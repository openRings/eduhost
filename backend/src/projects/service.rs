use anyhow::Context;
use eduhost::error::EndpointError;
use eduhost::error::EndpointResult;
use eduhost::service::Service;
use sqlx::PgPool;
use uuid::Uuid;

use crate::projects::commands::ProjectCreateCommand;
use crate::projects::dtos::{
    CreateProjectRequest, CreateProjectResponse, IsProjectAliasAvailableRequest,
    IsProjectAliasAvailableResponse, SubjectProjectsResponse,
};
use crate::projects::queries::{
    IsGroupAvailableForUserQuery, IsProjectAliasExistsQuery, IsSubjectAvailableForGroupQuery,
    SubjectProjectsByUserQuery,
};

pub struct ProjectsService {
    pool: PgPool,
}

impl ProjectsService {
    pub async fn is_project_alias_available(
        &self,
        body: IsProjectAliasAvailableRequest,
    ) -> EndpointResult<IsProjectAliasAvailableResponse> {
        let IsProjectAliasAvailableRequest { alias } = body;

        let is_alias_exists = IsProjectAliasExistsQuery { alias: &alias }
            .execute(&self.pool)
            .await
            .with_context(|| format!("failed to check project alias exists: {alias}"))?;

        Ok(IsProjectAliasAvailableResponse {
            is_available: !is_alias_exists,
        })
    }

    pub async fn get_projects(
        &self,
        user_id: Uuid,
        group_id: Uuid,
        query: Option<String>,
        subject_id: Option<Uuid>,
    ) -> EndpointResult<Vec<SubjectProjectsResponse>> {
        let models = SubjectProjectsByUserQuery {
            user_id,
            group_id,
            query,
            subject_id,
        }
        .execute(&self.pool)
        .await
        .with_context(|| {
            format!("failed to fetch projects, user id: {user_id}, group id: {group_id}")
        })?;

        Ok(SubjectProjectsResponse::from_models(models))
    }

    pub async fn create_project(
        &self,
        user_id: Uuid,
        body: CreateProjectRequest,
    ) -> EndpointResult<CreateProjectResponse> {
        let CreateProjectRequest {
            name,
            alias,
            group_id,
            subject_id,
        } = body;

        let has_group = IsGroupAvailableForUserQuery { user_id, group_id }
            .execute(&self.pool)
            .await
            .with_context(|| {
                format!(
                    "failed to check group availability, user id: {user_id}, group id: {group_id}"
                )
            })?;

        if !has_group {
            return Err(EndpointError::bad_request_with_error(
                "Группа не найдена или недоступна для пользователя",
                "MissingGroup",
            ));
        }

        let has_subject = IsSubjectAvailableForGroupQuery {
            subject_id,
            group_id,
        }
        .execute(&self.pool)
        .await
        .with_context(|| {
            format!("failed to check subject availability, subject id: {subject_id}, group id: {group_id}")
        })?;

        if !has_subject {
            return Err(EndpointError::bad_request_with_error(
                "Предмет не привязан к указанной группе",
                "MissingSubject",
            ));
        }

        let is_alias_exists = IsProjectAliasExistsQuery { alias: &alias }
            .execute(&self.pool)
            .await
            .with_context(|| format!("failed to check project alias exists: {alias}"))?;

        if is_alias_exists {
            return Err(EndpointError::bad_request("Алиас проекта уже занят"));
        }

        let project_id = Uuid::now_v7();

        ProjectCreateCommand {
            project_id,
            name: &name,
            alias: &alias,
            owner_id: user_id,
            subject_id,
        }
        .execute(&self.pool)
        .await
        .with_context(|| {
            format!(
                "failed to create project, project id: {project_id}, user id: {user_id}, subject id: {subject_id}"
            )
        })?;

        Ok(CreateProjectResponse { id: project_id })
    }
}

impl Service for ProjectsService {
    fn from_state(pool: PgPool) -> Self {
        Self { pool }
    }
}
