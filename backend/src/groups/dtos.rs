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

#[cfg(test)]
mod tests {
    use uuid::Uuid;

    use super::*;
    use crate::groups::queries::GroupModel;

    #[test]
    fn get_group_response_from_model_maps_fields() {
        let id = Uuid::now_v7();
        let model = GroupModel {
            id,
            name: "Group A".to_string(),
        };

        let response = GetGroupResponse::from_model(model);

        assert_eq!(response.id, id);
        assert_eq!(response.name, "Group A");
    }
}
