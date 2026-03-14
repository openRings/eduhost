#![allow(dead_code)]

use anyhow::{Context, anyhow, bail};
use reqwest::{Client, Response, StatusCode};
use serde_json::{Value, json};
use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;
use std::net::SocketAddr;
use std::path::Path;
use testcontainers_modules::postgres::Postgres;
use testcontainers_modules::testcontainers::ContainerAsync;
use testcontainers_modules::testcontainers::core::IntoContainerPort;
use testcontainers_modules::testcontainers::runners::AsyncRunner;
use tokio::net::TcpListener;
use tokio::task::JoinHandle;

pub struct TestContext {
    pub client: Client,
    pub pool: PgPool,
    _db_container: ContainerAsync<Postgres>,
    _server_handle: JoinHandle<()>,
    base_url: String,
}

impl TestContext {
    pub fn api_url(&self, path: &str) -> String {
        format!("{}{}", self.base_url, path)
    }
}

impl Drop for TestContext {
    fn drop(&mut self) {
        self._server_handle.abort();
    }
}

pub async fn spawn_test_context() -> anyhow::Result<TestContext> {
    let postgres = Postgres::default()
        .start()
        .await
        .context("failed to start postgres container; ensure Docker is running")?;

    let db_host = postgres
        .get_host()
        .await
        .context("failed to resolve postgres container host")?;
    let db_port = postgres
        .get_host_port_ipv4(5432.tcp())
        .await
        .context("failed to resolve postgres mapped port")?;

    let database_url = format!("postgres://postgres:postgres@{db_host}:{db_port}/postgres");

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .with_context(|| format!("failed to connect to postgres at {database_url}"))?;

    let migrations_path = Path::new(env!("CARGO_MANIFEST_DIR")).join("../migrations");
    let migrator = sqlx::migrate::Migrator::new(migrations_path.as_path())
        .await
        .with_context(|| {
            format!(
                "failed to build migrator from {}",
                migrations_path.to_string_lossy()
            )
        })?;

    migrator
        .run(&pool)
        .await
        .context("failed to apply migrations in test database")?;

    let listener = TcpListener::bind("127.0.0.1:0")
        .await
        .context("failed to bind test HTTP listener")?;
    let address = listener
        .local_addr()
        .context("failed to read bound test HTTP address")?;

    let server_pool = pool.clone();
    let server = tokio::spawn(async move {
        let app = eduhost::app::router(server_pool);

        if let Err(error) = axum::serve(listener, app).await {
            panic!("test app server failed: {error:#}");
        }
    });

    let client = Client::builder()
        .cookie_store(true)
        .build()
        .context("failed to build reqwest client")?;

    Ok(TestContext {
        client,
        pool,
        _db_container: postgres,
        _server_handle: server,
        base_url: format!("http://{}", to_host(address)),
    })
}

pub fn signup_body(username: &str, password: &str) -> Value {
    json!({
        "username": username,
        "firstName": "Test",
        "lastName": "Account",
        "patronymic": "Middle",
        "password": password,
        "passwordRepeat": password
    })
}

pub fn signin_body(username: &str, password: &str) -> Value {
    json!({
        "username": username,
        "password": password
    })
}

pub async fn assert_status(response: Response, expected: StatusCode) -> anyhow::Result<Response> {
    let actual = response.status();

    if actual != expected {
        let body = response
            .text()
            .await
            .unwrap_or_else(|_| "<failed to read response body>".to_string());

        bail!("unexpected status: expected {expected}, got {actual}, body: {body}");
    }

    Ok(response)
}

pub async fn json_field_as_str(response: Response, field: &str) -> anyhow::Result<String> {
    let body: Value = response
        .json()
        .await
        .context("failed to parse json response body")?;

    let value = body
        .get(field)
        .and_then(Value::as_str)
        .ok_or_else(|| anyhow!("json field `{field}` is missing or not a string: {body}"))?;

    Ok(value.to_string())
}

fn to_host(address: SocketAddr) -> String {
    match address {
        SocketAddr::V4(addr) => format!("127.0.0.1:{}", addr.port()),
        SocketAddr::V6(addr) => format!("[::1]:{}", addr.port()),
    }
}
