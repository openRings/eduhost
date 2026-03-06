use serde::Serialize;
use uuid::Uuid;

use crate::groups::queries::GroupModel;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetGroupResponse {
    pub id: Uuid,
    pub name: String,
}

impl GetGroupResponse {
    pub fn from_model(model: GroupModel) -> Self {
        let GroupModel { id, name } = model;

        Self { id, name }
    }
}
