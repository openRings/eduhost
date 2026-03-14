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

#[cfg(test)]
mod tests {
    use time::OffsetDateTime;
    use uuid::Uuid;

    use super::*;
    use crate::databases::queries::DatabaseByUserModel;

    #[test]
    fn get_database_response_from_model_converts_timestamp_to_unix_seconds() {
        let project_id = Uuid::now_v7();
        let created_at = OffsetDateTime::from_unix_timestamp(1_700_000_000)
            .expect("valid unix timestamp for test");
        let model = DatabaseByUserModel {
            name: "db_main".to_string(),
            disk_usage_bytes: 2048,
            created_at,
            project_id,
        };

        let response = GetDatabaseResponse::from_model(model);

        assert_eq!(response.name, "db_main");
        assert_eq!(response.disk_usage_bytes, 2048);
        assert_eq!(response.created_at, 1_700_000_000);
        assert_eq!(response.project_id, project_id);
    }
}
