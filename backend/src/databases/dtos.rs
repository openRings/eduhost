use serde::Serialize;
use uuid::Uuid;

use crate::databases::queries::DatabaseByUserModel;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetDatabaseResponse {
    pub name: String,
    pub disk_usage_bytes: i64,
    pub created_at: i64,
    pub project_id: Uuid,
}

impl GetDatabaseResponse {
    pub fn from_model(model: DatabaseByUserModel) -> Self {
        let DatabaseByUserModel {
            name,
            disk_usage_bytes,
            created_at,
            project_id,
        } = model;

        Self {
            name,
            disk_usage_bytes,
            created_at: created_at.unix_timestamp(),
            project_id,
        }
    }
}
