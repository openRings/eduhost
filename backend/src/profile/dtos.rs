use eduhost::session::AccessLevel;
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
    pub used: i64,
    #[serde(rename = "avaliable")]
    pub available: i64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetAccountMetricsResponse {
    pub disk_usage: DiskUsageResponse,
    pub project_count: i64,
    pub group_count: i64,
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
            group_count,
        } = model;

        Self {
            disk_usage: DiskUsageResponse {
                used: disk_used_bytes,
                available: disk_available_bytes,
            },
            project_count,
            group_count,
        }
    }
}
