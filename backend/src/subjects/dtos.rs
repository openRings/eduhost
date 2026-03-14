use serde::Serialize;
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

#[cfg(test)]
mod tests {
    use uuid::Uuid;

    use super::*;
    use crate::subjects::queries::SubjectModel;

    #[test]
    fn get_subject_response_from_model_maps_teacher_and_disk_usage() {
        let subject_id = Uuid::now_v7();
        let teacher_id = Uuid::now_v7();
        let model = SubjectModel {
            id: subject_id,
            name: "Math".to_string(),
            reserved_disk_bytes: 50_000,
            teacher_id,
            teacher_first_name: "Ivan".to_string(),
            teacher_last_name: "Petrov".to_string(),
            teacher_patronymic: Some("Sergeevich".to_string()),
        };

        let response = GetSubjectResponse::from_model(model);

        assert_eq!(response.id, subject_id);
        assert_eq!(response.name, "Math");
        assert_eq!(response.teacher.id, teacher_id);
        assert_eq!(response.teacher.first_name, "Ivan");
        assert_eq!(response.teacher.last_name, "Petrov");
        assert_eq!(response.teacher.patronymic.as_deref(), Some("Sergeevich"));
        assert_eq!(response.disk_usage.avaliable_bytes, 50_000);
        assert_eq!(response.disk_usage.files_usage_bytes, 0);
        assert_eq!(response.disk_usage.database_usage_bytes, 0);
    }
}
