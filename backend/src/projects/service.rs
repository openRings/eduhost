use anyhow::Context;
use axum::http::StatusCode;
use eduhost::error::EndpointError;
use eduhost::error::EndpointResult;
use eduhost::service::Service;
use sqlx::PgPool;
use uuid::Uuid;

use crate::projects::commands::{
    ProjectCreateCommand, ProjectSourceCreateCommand, ProjectSourceUpdateCommand,
};
use crate::projects::dtos::{
    CreateProjectRequest, CreateProjectResponse, IsProjectAliasAvailableRequest,
    IsProjectAliasAvailableResponse, ProjectDatabaseResponse, ProjectDetailsDiskUsageResponse,
    ProjectDetailsResponse, ProjectSourceBranchResponse, ProjectSourceRequest,
    ProjectSourceResponse, ProjectSubjectResponse, ProjectUserResponse, SubjectProjectsResponse,
    TeacherResponse,
};
use crate::projects::queries::{
    IsGroupAvailableForUserQuery, IsProjectAliasExistsQuery, IsSubjectAvailableForGroupQuery,
    ProjectDetailsByUserQuery, ProjectGitBranchesBySourceQuery, ProjectSourceAccessByUserQuery,
    ProjectUsersByProjectQuery, SubjectProjectsByUserQuery,
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

    pub async fn get_project(
        &self,
        user_id: Uuid,
        project_id: Uuid,
    ) -> EndpointResult<ProjectDetailsResponse> {
        let details = ProjectDetailsByUserQuery {
            user_id,
            project_id,
        }
        .execute(&self.pool)
        .await
        .with_context(|| format!("failed to fetch project details, project id: {project_id}"))?
        .ok_or(EndpointError::Other(StatusCode::NOT_FOUND))?;

        let mut users = ProjectUsersByProjectQuery { project_id }
            .execute(&self.pool)
            .await
            .with_context(|| format!("failed to fetch project users, project id: {project_id}"))?
            .into_iter()
            .map(|user| ProjectUserResponse {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                patronymic: user.patronymic,
            })
            .collect::<Vec<_>>();

        if users.iter().all(|user| user.id != details.owner_id) {
            users.insert(
                0,
                ProjectUserResponse {
                    id: details.owner_id,
                    first_name: details.owner_first_name.clone(),
                    last_name: details.owner_last_name.clone(),
                    patronymic: details.owner_patronymic.clone(),
                },
            );
        }

        let source_branches = if let Some((repository_full_name, selected_branch_id)) = details
            .source_repository_full_name
            .clone()
            .zip(details.source_branch_id)
        {
            ProjectGitBranchesBySourceQuery {
                repository_full_name,
                selected_branch_id,
            }
            .execute(&self.pool)
            .await
            .context("failed to fetch project source branches")?
        } else {
            Vec::new()
        };

        let source = details
            .source_link
            .as_ref()
            .zip(details.source_branch.as_ref())
            .zip(details.source_root_dir.as_ref())
            .zip(details.source_size_bytes)
            .map(
                |(((link, branch), root_dir), size_bytes)| ProjectSourceResponse {
                    source_type: "git".to_string(),
                    link: link.clone(),
                    current_branch: branch.clone(),
                    branches: source_branches
                        .iter()
                        .map(|source_branch| ProjectSourceBranchResponse {
                            id: source_branch.id,
                            name: source_branch.name.clone(),
                            is_exists: source_branch.is_exists,
                        })
                        .collect(),
                    root_dir: root_dir.clone(),
                    size_bytes,
                },
            );

        let database = details
            .database_id
            .map(|database_id| ProjectDatabaseResponse {
                id: database_id,
                name: details.database_name.unwrap_or_default(),
                password: details.database_password.unwrap_or_default(),
                disk_usage_bytes: details.database_disk_usage_bytes,
            });

        Ok(ProjectDetailsResponse {
            id: details.project_id,
            name: details.project_name,
            label: details.project_alias,
            subject: ProjectSubjectResponse {
                id: details.subject_id,
                name: details.subject_name,
                teacher: TeacherResponse {
                    id: details.teacher_id,
                    first_name: details.teacher_first_name,
                    last_name: details.teacher_last_name,
                    patronymic: details.teacher_patronymic,
                },
            },
            owner: ProjectUserResponse {
                id: details.owner_id,
                first_name: details.owner_first_name,
                last_name: details.owner_last_name,
                patronymic: details.owner_patronymic,
            },
            users,
            source,
            database,
            disk_usage: ProjectDetailsDiskUsageResponse {
                avaliable_bytes: details.subject_reserved_disk_bytes,
                files_bytes: details.source_size_bytes.unwrap_or_default(),
                database_bytes: details.database_disk_usage_bytes,
                other_projects_bytes: details.other_projects_bytes,
            },
        })
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

    pub async fn set_project_source(
        &self,
        user_id: Uuid,
        project_id: Uuid,
        body: ProjectSourceRequest,
    ) -> EndpointResult<()> {
        let ProjectSourceRequest {
            root_dir,
            repository_url: repository_full_name,
        } = body;

        let project = ProjectSourceAccessByUserQuery {
            user_id,
            project_id,
        }
        .execute(&self.pool)
        .await
        .with_context(|| {
            format!(
                "failed to check source access by user, user id: {user_id}, project id: {project_id}"
            )
        })?
        .ok_or(EndpointError::Other(StatusCode::NOT_FOUND))?;

        if let Some(source_id) = project.source_id {
            let branch_id = Uuid::now_v7();

            ProjectSourceUpdateCommand {
                source_id,
                branch_id,
                repository_full_name: &repository_full_name,
                root_dir: &root_dir,
            }
            .execute(&self.pool)
            .await
            .with_context(|| {
                format!("failed to update project source, project id: {project_id}, source id: {source_id}")
            })?;
        } else {
            let source_id = Uuid::now_v7();
            let branch_id = Uuid::now_v7();

            ProjectSourceCreateCommand {
                source_id,
                branch_id,
                project_id,
                repository_full_name: &repository_full_name,
                root_dir: &root_dir,
            }
            .execute(&self.pool)
            .await
            .with_context(|| {
                format!("failed to create project source, project id: {project_id}, source id: {source_id}")
            })?;
        }

        Ok(())
    }
}

impl Service for ProjectsService {
    fn from_state(pool: PgPool) -> Self {
        Self { pool }
    }
}
