use crate::normalize::Normalize;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::projects::queries::SubjectProjectModel;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TeacherResponse {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub patronymic: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubjectDiskUsageResponse {
    pub used_bytes: i64,
    pub avaliable_bytes: i64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectDiskUsageResponse {
    pub file_bytes: i64,
    pub database_bytes: i64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectResponse {
    pub id: Uuid,
    pub name: String,
    pub alias: String,
    pub disk_usage: ProjectDiskUsageResponse,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubjectProjectsResponse {
    pub id: Uuid,
    pub name: String,
    pub teacher: TeacherResponse,
    pub disk_usage: SubjectDiskUsageResponse,
    pub projects: Vec<ProjectResponse>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateProjectRequest {
    pub name: String,
    pub alias: String,
    pub group_id: Uuid,
    pub subject_id: Uuid,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetProjectsQuery {
    pub query: Option<String>,
    pub subject_id: Option<Uuid>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateProjectResponse {
    pub id: Uuid,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectUserResponse {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub patronymic: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectSubjectResponse {
    pub id: Uuid,
    pub name: String,
    pub teacher: TeacherResponse,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectSourceBranchResponse {
    pub id: Uuid,
    pub name: String,
    pub is_exists: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectSourceResponse {
    #[serde(rename = "type")]
    pub source_type: String,
    pub link: String,
    pub current_branch: String,
    pub branches: Vec<ProjectSourceBranchResponse>,
    pub root_dir: String,
    pub size_bytes: i64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectDatabaseResponse {
    pub id: Uuid,
    pub name: String,
    pub password: String,
    pub disk_usage_bytes: i64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectDetailsDiskUsageResponse {
    pub avaliable_bytes: i64,
    pub files_bytes: i64,
    pub database_bytes: i64,
    pub other_projects_bytes: i64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectDetailsResponse {
    pub id: Uuid,
    pub name: String,
    pub label: String,
    pub subject: ProjectSubjectResponse,
    pub owner: ProjectUserResponse,
    pub users: Vec<ProjectUserResponse>,
    pub source: Option<ProjectSourceResponse>,
    pub database: Option<ProjectDatabaseResponse>,
    pub disk_usage: ProjectDetailsDiskUsageResponse,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IsProjectAliasAvailableRequest {
    pub alias: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectSourceRequest {
    pub root_dir: String,
    pub repository_url: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct IsProjectAliasAvailableResponse {
    pub is_available: bool,
}

fn is_valid_github_part(value: &str) -> bool {
    !value.is_empty()
        && value.chars().all(|char| {
            char.is_ascii_lowercase()
                || char.is_ascii_uppercase()
                || char.is_ascii_digit()
                || char == '-'
                || char == '_'
                || char == '.'
        })
}

fn normalize_repository_url(repository_url: &str) -> Result<String, String> {
    let mut value = repository_url.trim().to_string();

    if value.is_empty() {
        return Err("Ссылка на репозиторий обязательна".to_string());
    }

    let is_full_url = value.contains("://") || value.starts_with("github.com/");
    let had_scheme = value.contains("://");

    if had_scheme {
        let value_without_scheme = value
            .strip_prefix("https://")
            .or_else(|| value.strip_prefix("http://"))
            .ok_or("Ссылка на репозиторий должна быть с протоколом http или https".to_string())?;

        if !value_without_scheme.starts_with("github.com/") {
            return Err("Поддерживаются только ссылки на github.com".to_string());
        }
    }

    value = value
        .strip_prefix("https://")
        .or_else(|| value.strip_prefix("http://"))
        .unwrap_or(&value)
        .to_string();

    value = value
        .strip_prefix("github.com/")
        .unwrap_or(&value)
        .to_string();

    value = value.trim_matches('/').to_string();

    if let Some((value_without_query, _)) = value.split_once('?') {
        value = value_without_query.to_string();
    }

    if let Some((value_without_hash, _)) = value.split_once('#') {
        value = value_without_hash.to_string();
    }

    if let Some(repo_without_suffix) = value.strip_suffix(".git") {
        value = repo_without_suffix.to_string();
    }

    let mut parts = value.split('/').filter(|part| !part.is_empty());
    let username = parts
        .next()
        .ok_or("Ссылка на репозиторий должна быть в формате {username}/{repo}".to_string())?;
    let repo = parts
        .next()
        .ok_or("Ссылка на репозиторий должна быть в формате {username}/{repo}".to_string())?;
    let has_extra_parts = parts.next().is_some();

    if !is_full_url && has_extra_parts {
        return Err("Ссылка на репозиторий должна быть в формате {username}/{repo}".to_string());
    }

    if !is_valid_github_part(username) || !is_valid_github_part(repo) {
        return Err("Некорректная ссылка на репозиторий".to_string());
    }

    Ok(format!("{username}/{repo}"))
}

impl SubjectProjectsResponse {
    pub fn from_models(models: Vec<SubjectProjectModel>) -> Vec<Self> {
        let mut subjects: Vec<Self> = Vec::new();

        for model in models {
            let SubjectProjectModel {
                subject_id,
                subject_name,
                subject_reserved_disk_bytes,
                teacher_id,
                teacher_first_name,
                teacher_last_name,
                teacher_patronymic,
                project_id,
                project_name,
                project_alias,
                project_file_usage_bytes,
                project_database_usage_bytes,
            } = model;

            let subject_index = subjects.iter().position(|subject| subject.id == subject_id);

            let index = if let Some(index) = subject_index {
                index
            } else {
                subjects.push(Self {
                    id: subject_id,
                    name: subject_name,
                    teacher: TeacherResponse {
                        id: teacher_id,
                        first_name: teacher_first_name,
                        last_name: teacher_last_name,
                        patronymic: teacher_patronymic,
                    },
                    disk_usage: SubjectDiskUsageResponse {
                        used_bytes: 0,
                        avaliable_bytes: subject_reserved_disk_bytes,
                    },
                    projects: Vec::new(),
                });

                subjects.len() - 1
            };

            let Some(project_id) = project_id else {
                continue;
            };
            let Some(project_name) = project_name else {
                continue;
            };
            let Some(project_alias) = project_alias else {
                continue;
            };

            subjects[index].projects.push(ProjectResponse {
                id: project_id,
                name: project_name,
                alias: project_alias,
                disk_usage: ProjectDiskUsageResponse {
                    file_bytes: project_file_usage_bytes,
                    database_bytes: project_database_usage_bytes,
                },
            });
        }

        subjects
    }
}

impl Normalize for CreateProjectRequest {
    fn normalize(mut self) -> Result<Self, String> {
        self.name = self.name.trim().to_string();
        self.alias = self.alias.trim().to_string();

        if !(4..=50).contains(&self.name.chars().count()) {
            return Err("Название проекта должно быть длиной от 4 до 50 символов".to_string());
        }

        if !(3..=12).contains(&self.alias.chars().count()) {
            return Err("Алиас проекта должен быть длиной от 3 до 12 символов".to_string());
        }

        let is_alias_valid = self.alias.chars().all(|char| {
            char.is_ascii_lowercase() || char.is_ascii_uppercase() || char == '-' || char == '_'
        });

        if !is_alias_valid {
            return Err("Алиас проекта должен содержать только символы a-z, A-Z, -, _".to_string());
        }

        Ok(self)
    }
}

impl Normalize for IsProjectAliasAvailableRequest {
    fn normalize(mut self) -> Result<Self, String> {
        self.alias = self.alias.trim().to_string();

        if self.alias.is_empty() {
            return Err("Алиас проекта обязателен".to_string());
        }

        Ok(self)
    }
}

impl Normalize for ProjectSourceRequest {
    fn normalize(mut self) -> Result<Self, String> {
        self.root_dir = self.root_dir.trim().to_string();
        self.repository_url = normalize_repository_url(&self.repository_url)?;

        if self.root_dir.is_empty() {
            return Err("Корневая директория обязательна".to_string());
        }

        if !self.root_dir.starts_with('/') {
            return Err("Корневая директория должна начинаться с '/'".to_string());
        }

        Ok(self)
    }
}

#[cfg(test)]
mod tests {
    use uuid::Uuid;

    use super::*;

    fn valid_create_project_request() -> CreateProjectRequest {
        CreateProjectRequest {
            name: "Новый проект".to_string(),
            alias: "ProjAlias".to_string(),
            group_id: Uuid::now_v7(),
            subject_id: Uuid::now_v7(),
        }
    }

    #[test]
    fn create_project_normalize_trims_fields() {
        let mut request = valid_create_project_request();
        request.name = "  Новый проект  ".to_string();
        request.alias = "  ProjAlias  ".to_string();

        let normalized = request.normalize().expect("expected normalized request");

        assert_eq!(normalized.name, "Новый проект");
        assert_eq!(normalized.alias, "ProjAlias");
    }

    #[test]
    fn create_project_normalize_rejects_alias_with_invalid_chars() {
        let mut request = valid_create_project_request();
        request.alias = "bad alias".to_string();

        let error = request.normalize().expect_err("expected validation error");

        assert_eq!(
            error,
            "Алиас проекта должен содержать только символы a-z, A-Z, -, _"
        );
    }

    #[test]
    fn project_source_normalize_accepts_github_full_url() {
        let request = ProjectSourceRequest {
            root_dir: " /src ".to_string(),
            repository_url: "https://github.com/openai/openai-cookbook.git".to_string(),
        };

        let normalized = request.normalize().expect("expected normalized request");

        assert_eq!(normalized.root_dir, "/src");
        assert_eq!(normalized.repository_url, "openai/openai-cookbook");
    }

    #[test]
    fn project_source_normalize_accepts_short_repository_format() {
        let request = ProjectSourceRequest {
            root_dir: "/".to_string(),
            repository_url: "OpenAI/openai-cookbook".to_string(),
        };

        let normalized = request.normalize().expect("expected normalized request");

        assert_eq!(normalized.repository_url, "OpenAI/openai-cookbook");
    }

    #[test]
    fn project_source_normalize_rejects_non_github_full_url() {
        let request = ProjectSourceRequest {
            root_dir: "/".to_string(),
            repository_url: "https://gitlab.com/openai/openai-cookbook".to_string(),
        };

        let error = request.normalize().expect_err("expected validation error");

        assert_eq!(error, "Поддерживаются только ссылки на github.com");
    }

    #[test]
    fn project_source_normalize_rejects_invalid_root_dir() {
        let request = ProjectSourceRequest {
            root_dir: "relative/path".to_string(),
            repository_url: "openai/openai-cookbook".to_string(),
        };

        let error = request.normalize().expect_err("expected validation error");

        assert_eq!(error, "Корневая директория должна начинаться с '/'");
    }
}
