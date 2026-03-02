use axum::Json;
use axum::http::HeaderValue;
use axum::http::header::SET_COOKIE;
use axum::response::{IntoResponse, Response};
use axum_cookie::prelude::Cookie;
use eduhost::normalize::Normalize;
use serde::Deserialize;
use serde_json::json;

#[derive(Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignupRequest {
    pub username: String,
    pub first_name: String,
    pub last_name: String,
    pub patronymic: Option<String>,
    pub password: String,
    pub password_repeat: String,
}

#[derive(Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SigninRequest {
    pub username: String,
    pub password: String,
}

pub struct NewSessionResponse {
    pub access_token: String,
    pub refresh_token: String,
}

impl Normalize for SignupRequest {
    fn normalize(self) -> Result<Self, String> {
        if !(4..=12).contains(&self.username.len()) {
            return Err("Юзернейм должен быть длиной от 4 до 12 символов".to_string());
        }

        let is_username_az09 = self
            .username
            .chars()
            .all(|c| c.is_ascii_lowercase() || c.is_ascii_digit());

        if !is_username_az09 {
            return Err("Юзернейм должен содержать только символы a-z, 0-9".to_string());
        }

        if self.username.chars().next().unwrap().is_ascii_digit() {
            return Err("Юзернейм не может начинаться с цифры".to_string());
        }

        if !(2..=30).contains(&self.first_name.len()) {
            return Err("Имя должно быть длиной от 2 до 30 символов".to_string());
        }

        if !(4..=30).contains(&self.last_name.len()) {
            return Err("Фамилия должна быть длиной от 4 до 30 символов".to_string());
        }

        if let Some(patronymic) = self.patronymic.as_ref()
            && !(4..=30).contains(&patronymic.len())
        {
            return Err("Отчество должно быть длиной от 4 до 30 символов".to_string());
        }

        if self.password != self.password_repeat {
            return Err("Пароли не совпадают".to_string());
        }

        if !(8..=30).contains(&self.password.len()) {
            return Err("Пароль должен быть длиной от 8 до 30 символов".to_string());
        }

        let mut has_lowercase = false;
        let mut has_uppercase = false;
        let mut has_digit = false;

        self.password.chars().for_each(|c| {
            if c.is_lowercase() {
                has_lowercase = true
            }

            if c.is_uppercase() {
                has_uppercase = true
            }

            if c.is_ascii_digit() {
                has_digit = true
            }
        });

        if !(has_lowercase && has_uppercase && has_digit) {
            return Err(
                "Пароль должен содержать верхний регистр, нижний регистр и цифры".to_string(),
            );
        }

        // TODO: add more verify

        Ok(self)
    }
}

impl Normalize for SigninRequest {
    fn normalize(mut self) -> Result<Self, String> {
        self.username.make_ascii_lowercase();

        Ok(self)
    }
}

impl IntoResponse for NewSessionResponse {
    fn into_response(self) -> Response {
        let cookie = Cookie::new("refresh-token", self.refresh_token)
            .with_path("/api/auth")
            .with_http_only(true)
            .with_secure(!cfg!(debug_assertions));

        let mut response = Json(json!({ "token": self.access_token })).into_response();

        let header_value = HeaderValue::from_str(&cookie.to_string()).expect("must be valid");

        response.headers_mut().insert(SET_COOKIE, header_value);

        response
    }
}
