use anyhow::Context;
use axum::routing::get;
use axum_prometheus::PrometheusMetricLayer;
use std::process;
use tokio::net::TcpListener;
use tracing_loki::url::Url;
use tracing_subscriber::EnvFilter;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let (prometheus_layer, metric_handle) = PrometheusMetricLayer::pair();

    let (layer, task) = tracing_loki::builder()
        .extra_field("pid", format!("{}", process::id()))?
        .build_url(Url::parse("http://loki:3100").unwrap())?;

    tracing_subscriber::registry()
        .with(EnvFilter::new("eduhost=info"))
        .with(layer)
        .init();

    tracing::info!("backend starting..");
    tokio::spawn(task);

    let pool = eduhost::database::init_database_pool()
        .await
        .context("failed to init database pool")?;

    let router = eduhost::app::router(pool)
        .route("/metrics", get(|| async move { metric_handle.render() }))
        .layer(prometheus_layer);

    let listener = TcpListener::bind("0.0.0.0:80")
        .await
        .context("failed to bind addr")?;

    axum::serve(listener, router)
        .await
        .context("failed to serve")?;

    Ok(())
}
