use anyhow::Context;
use reqwest::StatusCode;
use sqlx::Row;

mod support;

use support::{assert_status, signup_body, spawn_test_context};

#[tokio::test]
async fn signup_creates_user_and_returns_201() -> anyhow::Result<()> {
    let context = spawn_test_context().await?;
    let username = "newstudent";
    let password = "Password123";

    let response = context
        .client
        .post(context.api_url("/auth/signup"))
        .json(&signup_body(username, password))
        .send()
        .await
        .context("failed to call POST /auth/signup")?;

    assert_status(response, StatusCode::CREATED).await?;

    let created_username: String = sqlx::query("SELECT username FROM users WHERE username = $1")
        .bind(username)
        .fetch_optional(&context.pool)
        .await
        .context("failed to query created user")?
        .map(|row| row.get("username"))
        .context("user row was not created after successful signup")?;

    assert_eq!(
        created_username, username,
        "created username mismatch after signup"
    );

    Ok(())
}

#[tokio::test]
async fn signup_rejects_duplicate_username() -> anyhow::Result<()> {
    let context = spawn_test_context().await?;
    let username = "duplicated";
    let password = "Password123";

    let first_response = context
        .client
        .post(context.api_url("/auth/signup"))
        .json(&signup_body(username, password))
        .send()
        .await
        .context("failed to call first POST /auth/signup")?;
    assert_status(first_response, StatusCode::CREATED).await?;

    let second_response = context
        .client
        .post(context.api_url("/auth/signup"))
        .json(&signup_body(username, password))
        .send()
        .await
        .context("failed to call second POST /auth/signup")?;

    let second_response = assert_status(second_response, StatusCode::BAD_REQUEST).await?;
    let body = second_response
        .text()
        .await
        .context("failed to read duplicate-signup response body")?;

    assert!(
        body.contains("Юзернейм занят другим пользователем"),
        "expected duplicate username message in response body, got: {body}"
    );

    Ok(())
}
