use serde::Serialize;
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
