use crate::session::AccessLevel;
use serde::Serialize;

use crate::profile::queries::{AccountMetricsModel, ProfileModel};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetProfileResponse {
    pub username: String,
    pub first_name: String,
    pub last_name: String,
    pub patronymic: Option<String>,
    pub access: AccessLevel,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiskUsageResponse {
    pub used_bytes: i64,
    pub avaliable_bytes: i64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetAccountMetricsResponse {
    pub disk_usage: DiskUsageResponse,
    pub project_count: i64,
    pub subject_count: i64,
}

impl GetProfileResponse {
    pub fn from_model(model: ProfileModel, access: AccessLevel) -> Self {
        let ProfileModel {
            username,
            first_name,
            last_name,
            patronymic,
        } = model;

        Self {
            username,
            first_name,
            last_name,
            patronymic,
            access,
        }
    }
}

impl GetAccountMetricsResponse {
    pub fn from_model(model: AccountMetricsModel) -> Self {
        let AccountMetricsModel {
            disk_used_bytes,
            disk_available_bytes,
            project_count,
            subject_count,
        } = model;

        Self {
            disk_usage: DiskUsageResponse {
                used_bytes: disk_used_bytes,
                avaliable_bytes: disk_available_bytes,
            },
            project_count,
            subject_count,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::profile::queries::{AccountMetricsModel, ProfileModel};

    #[test]
    fn get_profile_response_from_model_maps_all_fields() {
        let model = ProfileModel {
            username: "student1".to_string(),
            first_name: "Ivan".to_string(),
            last_name: "Petrov".to_string(),
            patronymic: Some("Sergeevich".to_string()),
        };

        let response = GetProfileResponse::from_model(model, AccessLevel::Student);

        assert_eq!(response.username, "student1");
        assert_eq!(response.first_name, "Ivan");
        assert_eq!(response.last_name, "Petrov");
        assert_eq!(response.patronymic.as_deref(), Some("Sergeevich"));
        assert_eq!(response.access, AccessLevel::Student);
    }

    #[test]
    fn account_metrics_response_from_model_maps_disk_and_counters() {
        let model = AccountMetricsModel {
            disk_used_bytes: 1_000,
            disk_available_bytes: 10_000,
            project_count: 3,
            subject_count: 2,
        };

        let response = GetAccountMetricsResponse::from_model(model);

        assert_eq!(response.disk_usage.used_bytes, 1_000);
        assert_eq!(response.disk_usage.avaliable_bytes, 10_000);
        assert_eq!(response.project_count, 3);
        assert_eq!(response.subject_count, 2);
    }
}
