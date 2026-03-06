use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::subjects::queries::SubjectModel;

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
    pub files_usage_bytes: i64,
    pub database_usage_bytes: i64,
    pub avaliable_bytes: i64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetSubjectResponse {
    pub id: Uuid,
    pub name: String,
    pub teacher: TeacherResponse,
    pub disk_usage: SubjectDiskUsageResponse,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetSubjectsQuery {
    pub group_id: Option<String>,
}

impl GetSubjectResponse {
    pub fn from_model(model: SubjectModel) -> Self {
        let SubjectModel {
            id,
            name,
            teacher_id,
            teacher_first_name,
            teacher_last_name,
            teacher_patronymic,
            reserved_disk_bytes,
        } = model;

        Self {
            id,
            name,
            teacher: TeacherResponse {
                id: teacher_id,
                first_name: teacher_first_name,
                last_name: teacher_last_name,
                patronymic: teacher_patronymic,
            },
            disk_usage: SubjectDiskUsageResponse {
                files_usage_bytes: 0,
                database_usage_bytes: 0,
                avaliable_bytes: reserved_disk_bytes,
            },
        }
    }
}
