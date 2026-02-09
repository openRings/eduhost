use axum::Json;
use axum::response::{IntoResponse, Response};
use axum_cookie::prelude::{Cookie, CookieManager};
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

#[derive(Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SigninRequest {
    pub username: String,
    pub password: String,
}

impl Normalize for SigninRequest {
    fn normalize(mut self) -> Result<Self, String> {
        self.username.make_ascii_lowercase();

        Ok(self)
    }
}

pub struct SigninResponse {
    pub access_token: String,
    pub refresh_token: String,
    pub cookies: CookieManager,
}

impl IntoResponse for SigninResponse {
    fn into_response(self) -> Response {
        let mut cookie = Cookie::new("refresh-token", self.refresh_token);

        cookie.set_http_only(true);
        cookie.set_secure(!cfg!(debug_assertions));

        self.cookies.add(cookie);

        Json(json!({ "token": self.access_token })).into_response()
    }
}
