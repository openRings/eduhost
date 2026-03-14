use anyhow::Context;
use reqwest::StatusCode;

mod support;

use support::{
    assert_status, extract_refresh_token, json_field_as_str, signin_body, signup_body,
    spawn_test_context,
};

#[tokio::test]
async fn username_available_reflects_signup_state() -> anyhow::Result<()> {
    let context = spawn_test_context().await?;
    let username = "availability";
    let password = "Password123";

    let available_before_response = context
        .client
        .post(context.api_url("/auth/username/available"))
        .json(&serde_json::json!({ "username": username }))
        .send()
        .await
        .context("failed to call POST /auth/username/available before signup (2nd read)")?;
    let available_before_response =
        assert_status(available_before_response, StatusCode::OK).await?;
    let available_before_json: serde_json::Value = available_before_response
        .json()
        .await
        .context("failed to parse username available response before signup")?;
    let is_available_before = available_before_json
        .get("isAvailable")
        .and_then(serde_json::Value::as_bool)
        .context("missing boolean field isAvailable before signup")?;
    assert!(
        is_available_before,
        "username should be available before signup"
    );

    let signup_response = context
        .client
        .post(context.api_url("/auth/signup"))
        .json(&signup_body(username, password))
        .send()
        .await
        .context("failed to call POST /auth/signup")?;
    assert_status(signup_response, StatusCode::CREATED).await?;

    let available_after_response = context
        .client
        .post(context.api_url("/auth/username/available"))
        .json(&serde_json::json!({ "username": username }))
        .send()
        .await
        .context("failed to call POST /auth/username/available after signup")?;
    let available_after_response = assert_status(available_after_response, StatusCode::OK).await?;
    let available_after_json: serde_json::Value = available_after_response
        .json()
        .await
        .context("failed to parse username available response after signup")?;
    let is_available_after = available_after_json
        .get("isAvailable")
        .and_then(serde_json::Value::as_bool)
        .context("missing boolean field isAvailable after signup")?;

    assert!(
        !is_available_after,
        "username should be unavailable after successful signup"
    );

    Ok(())
}

#[tokio::test]
async fn refresh_returns_new_access_token_with_valid_refresh_cookie() -> anyhow::Result<()> {
    let context = spawn_test_context().await?;
    let username = "refreshuser";
    let password = "Password123";

    let signup_response = context
        .client
        .post(context.api_url("/auth/signup"))
        .json(&signup_body(username, password))
        .send()
        .await
        .context("failed to call POST /auth/signup before refresh flow")?;
    assert_status(signup_response, StatusCode::CREATED).await?;

    let signin_response = context
        .client
        .post(context.api_url("/auth/signin"))
        .json(&signin_body(username, password))
        .send()
        .await
        .context("failed to call POST /auth/signin before refresh flow")?;
    let signin_set_cookie = signin_response
        .headers()
        .get("set-cookie")
        .and_then(|header| header.to_str().ok())
        .map(ToString::to_string)
        .context("missing Set-Cookie header in signin response")?;
    let signin_response = assert_status(signin_response, StatusCode::OK).await?;
    let old_token = json_field_as_str(signin_response, "token").await?;
    let refresh_token = extract_refresh_token(&signin_set_cookie)?;

    let refresh_response = context
        .client
        .post(context.api_url("/auth/refresh"))
        .header("Cookie", format!("refresh-token={refresh_token}"))
        .send()
        .await
        .context("failed to call POST /auth/refresh")?;

    let refresh_set_cookie = refresh_response
        .headers()
        .get("set-cookie")
        .and_then(|header| header.to_str().ok())
        .map(ToString::to_string)
        .context("missing Set-Cookie header in refresh response")?;
    let refresh_response = assert_status(refresh_response, StatusCode::OK).await?;
    let new_token = json_field_as_str(refresh_response, "token").await?;
    let new_refresh_token = extract_refresh_token(&refresh_set_cookie)?;

    assert_ne!(
        old_token, new_token,
        "refresh should issue a new access token"
    );
    assert_ne!(
        refresh_token, new_refresh_token,
        "refresh should rotate refresh token"
    );

    Ok(())
}

#[tokio::test]
async fn logout_invalidates_current_access_token() -> anyhow::Result<()> {
    let context = spawn_test_context().await?;
    let username = "logoutuser";
    let password = "Password123";

    let signup_response = context
        .client
        .post(context.api_url("/auth/signup"))
        .json(&signup_body(username, password))
        .send()
        .await
        .context("failed to call POST /auth/signup before logout flow")?;
    assert_status(signup_response, StatusCode::CREATED).await?;

    let signin_response = context
        .client
        .post(context.api_url("/auth/signin"))
        .json(&signin_body(username, password))
        .send()
        .await
        .context("failed to call POST /auth/signin before logout flow")?;
    let signin_response = assert_status(signin_response, StatusCode::OK).await?;
    let access_token = json_field_as_str(signin_response, "token").await?;

    let session_before_logout = context
        .client
        .get(context.api_url("/session"))
        .bearer_auth(&access_token)
        .send()
        .await
        .context("failed to call GET /session before logout")?;
    assert_status(session_before_logout, StatusCode::OK).await?;

    let logout_response = context
        .client
        .post(context.api_url("/auth/logout"))
        .bearer_auth(&access_token)
        .send()
        .await
        .context("failed to call POST /auth/logout")?;
    assert_status(logout_response, StatusCode::NO_CONTENT).await?;

    let session_after_logout = context
        .client
        .get(context.api_url("/session"))
        .bearer_auth(&access_token)
        .send()
        .await
        .context("failed to call GET /session after logout")?;
    assert_status(session_after_logout, StatusCode::UNAUTHORIZED).await?;

    Ok(())
}
