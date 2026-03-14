use anyhow::Context;
use reqwest::StatusCode;

mod support;

use support::{assert_status, json_field_as_str, signin_body, signup_body, spawn_test_context};

#[tokio::test]
async fn signin_returns_access_token_and_refresh_cookie() -> anyhow::Result<()> {
    let context = spawn_test_context().await?;
    let username = "signinuser";
    let password = "Password123";

    let signup_response = context
        .client
        .post(context.api_url("/auth/signup"))
        .json(&signup_body(username, password))
        .send()
        .await
        .context("failed to call POST /auth/signup before signin")?;
    assert_status(signup_response, StatusCode::CREATED).await?;

    let signin_response = context
        .client
        .post(context.api_url("/auth/signin"))
        .json(&signin_body(username, password))
        .send()
        .await
        .context("failed to call POST /auth/signin")?;

    let set_cookie = signin_response
        .headers()
        .get("set-cookie")
        .and_then(|header| header.to_str().ok())
        .map(ToString::to_string)
        .context("missing Set-Cookie header in signin response")?;

    let signin_response = assert_status(signin_response, StatusCode::OK).await?;
    let token = json_field_as_str(signin_response, "token").await?;

    assert!(
        !token.is_empty(),
        "signin response token should not be empty"
    );
    assert!(
        set_cookie.contains("refresh-token="),
        "signin Set-Cookie should contain refresh-token, got: {set_cookie}"
    );
    assert!(
        set_cookie.contains("HttpOnly"),
        "signin Set-Cookie should contain HttpOnly, got: {set_cookie}"
    );

    Ok(())
}

#[tokio::test]
async fn signin_rejects_wrong_password() -> anyhow::Result<()> {
    let context = spawn_test_context().await?;
    let username = "signinwrong";
    let password = "Password123";

    let signup_response = context
        .client
        .post(context.api_url("/auth/signup"))
        .json(&signup_body(username, password))
        .send()
        .await
        .context("failed to call POST /auth/signup before wrong-password signin")?;
    assert_status(signup_response, StatusCode::CREATED).await?;

    let signin_response = context
        .client
        .post(context.api_url("/auth/signin"))
        .json(&signin_body(username, "WrongPassword123"))
        .send()
        .await
        .context("failed to call POST /auth/signin with wrong password")?;

    assert_status(signin_response, StatusCode::FORBIDDEN).await?;

    Ok(())
}
