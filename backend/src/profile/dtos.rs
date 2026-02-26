use eduhost::session::AccessLevel;
use serde::Serialize;

use crate::profile::queries::ProfileModel;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GetProfileResponse {
    pub username: String,
    pub first_name: String,
    pub last_name: String,
    pub patronymic: Option<String>,
    pub access: AccessLevel,
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
