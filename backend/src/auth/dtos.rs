use crate::normalize::Normalize;
use axum::Json;
use axum::http::HeaderValue;
use axum::http::header::SET_COOKIE;
use axum::response::{IntoResponse, Response};
use axum_cookie::prelude::Cookie;
use serde::{Deserialize, Serialize};
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

#[derive(Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IsUsernameAvailableRequest {
    pub username: String,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct IsUsernameAvailableResponse {
    pub is_available: bool,
}

pub struct NewSessionResponse {
    pub access_token: String,
    pub refresh_token: String,
}

impl Normalize for SignupRequest {
    fn normalize(mut self) -> Result<Self, String> {
        self.username = self.username.trim().to_string();
        self.username.make_ascii_lowercase();
        self.first_name = self.first_name.trim().to_string();
        self.last_name = self.last_name.trim().to_string();
        self.patronymic = self
            .patronymic
            .map(|patronymic| patronymic.trim().to_string());

        if self
            .patronymic
            .as_ref()
            .is_some_and(|patronymic| patronymic.is_empty())
        {
            self.patronymic = None;
        }

        if !(4..=12).contains(&self.username.chars().count()) {
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

        if !(2..=30).contains(&self.first_name.chars().count()) {
            return Err("Имя должно быть длиной от 2 до 30 символов".to_string());
        }

        if !(4..=30).contains(&self.last_name.chars().count()) {
            return Err("Фамилия должна быть длиной от 4 до 30 символов".to_string());
        }

        if let Some(patronymic) = self.patronymic.as_ref()
            && !(4..=30).contains(&patronymic.chars().count())
        {
            return Err("Отчество должно быть длиной от 4 до 30 символов".to_string());
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

        if self.password != self.password_repeat {
            return Err("Пароли не совпадают".to_string());
        }

        // TODO: add more verify

        Ok(self)
    }
}

impl Normalize for SigninRequest {
    fn normalize(mut self) -> Result<Self, String> {
        self.username = self.username.trim().to_string();
        self.username.make_ascii_lowercase();

        if self.username.is_empty() {
            return Err("Юзернейм обязателен".to_string());
        }

        Ok(self)
    }
}

impl Normalize for IsUsernameAvailableRequest {
    fn normalize(mut self) -> Result<Self, String> {
        self.username = self.username.trim().to_string();
        self.username.make_ascii_lowercase();

        if self.username.is_empty() {
            return Err("Юзернейм обязателен".to_string());
        }

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

#[cfg(test)]
mod tests {
    use super::*;

    fn normalization_error<T>(result: Result<T, String>) -> String {
        match result {
            Ok(_) => panic!("expected validation error"),
            Err(error) => error,
        }
    }

    fn valid_signup() -> SignupRequest {
        SignupRequest {
            username: "validuser".to_string(),
            first_name: "Иван".to_string(),
            last_name: "Иванов".to_string(),
            patronymic: Some("Иванович".to_string()),
            password: "Password123".to_string(),
            password_repeat: "Password123".to_string(),
        }
    }

    #[test]
    fn signup_normalize_trims_and_lowercases_fields() {
        let request = SignupRequest {
            username: "  VaLiDUsEr  ".to_string(),
            first_name: "  Иван  ".to_string(),
            last_name: "  Иванов  ".to_string(),
            patronymic: Some("  Иванович  ".to_string()),
            password: "Password123".to_string(),
            password_repeat: "Password123".to_string(),
        };

        let normalized = request.normalize().expect("expected normalized request");

        assert_eq!(normalized.username, "validuser");
        assert_eq!(normalized.first_name, "Иван");
        assert_eq!(normalized.last_name, "Иванов");
        assert_eq!(normalized.patronymic.as_deref(), Some("Иванович"));
    }

    #[test]
    fn signup_normalize_converts_empty_patronymic_to_none() {
        let mut request = valid_signup();
        request.patronymic = Some("   ".to_string());

        let normalized = request.normalize().expect("expected normalized request");

        assert_eq!(normalized.patronymic, None);
    }

    #[test]
    fn signup_normalize_rejects_username_starting_with_digit() {
        let mut request = valid_signup();
        request.username = "1validuser".to_string();

        let error = normalization_error(request.normalize());

        assert_eq!(error, "Юзернейм не может начинаться с цифры");
    }

    #[test]
    fn signup_normalize_rejects_username_with_invalid_chars() {
        let mut request = valid_signup();
        request.username = "valid_user".to_string();

        let error = normalization_error(request.normalize());

        assert_eq!(error, "Юзернейм должен содержать только символы a-z, 0-9");
    }

    #[test]
    fn signup_normalize_rejects_when_password_rules_not_satisfied() {
        let mut request = valid_signup();
        request.password = "password123".to_string();
        request.password_repeat = "password123".to_string();

        let error = normalization_error(request.normalize());

        assert_eq!(
            error,
            "Пароль должен содержать верхний регистр, нижний регистр и цифры"
        );
    }

    #[test]
    fn signup_normalize_rejects_when_passwords_do_not_match() {
        let mut request = valid_signup();
        request.password_repeat = "Password321".to_string();

        let error = normalization_error(request.normalize());

        assert_eq!(error, "Пароли не совпадают");
    }

    #[test]
    fn signin_normalize_trims_and_lowercases_username() {
        let request = SigninRequest {
            username: "  VaLiDUsEr  ".to_string(),
            password: "any".to_string(),
        };

        let normalized = request.normalize().expect("expected normalized request");

        assert_eq!(normalized.username, "validuser");
    }

    #[test]
    fn signin_normalize_rejects_empty_username() {
        let request = SigninRequest {
            username: "   ".to_string(),
            password: "any".to_string(),
        };

        let error = normalization_error(request.normalize());

        assert_eq!(error, "Юзернейм обязателен");
    }

    #[test]
    fn username_available_normalize_rejects_empty_username() {
        let request = IsUsernameAvailableRequest {
            username: "   ".to_string(),
        };

        let error = normalization_error(request.normalize());

        assert_eq!(error, "Юзернейм обязателен");
    }
}
