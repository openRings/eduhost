use anyhow::Context;
use sqlx::{FromRow, PgExecutor};
use uuid::Uuid;

#[derive(Debug, Clone, FromRow)]
pub struct SubjectProjectModel {
    pub subject_id: Uuid,
    pub subject_name: String,
    pub subject_reserved_disk_bytes: i64,
    pub teacher_id: Uuid,
    pub teacher_first_name: String,
    pub teacher_last_name: String,
    pub teacher_patronymic: Option<String>,
    pub project_id: Option<Uuid>,
    pub project_name: Option<String>,
    pub project_alias: Option<String>,
    pub project_file_usage_bytes: i64,
    pub project_database_usage_bytes: i64,
}

pub struct SubjectProjectsByUserQuery {
    pub user_id: Uuid,
    pub group_id: Uuid,
    pub query: Option<String>,
    pub subject_id: Option<Uuid>,
}

pub struct IsGroupAvailableForUserQuery {
    pub user_id: Uuid,
    pub group_id: Uuid,
}

pub struct IsSubjectAvailableForGroupQuery {
    pub subject_id: Uuid,
    pub group_id: Uuid,
}

pub struct IsProjectAliasExistsQuery<'a> {
    pub alias: &'a str,
}

#[derive(Debug, Clone, FromRow)]
pub struct ProjectDetailsModel {
    pub project_id: Uuid,
    pub project_name: String,
    pub project_alias: String,
    pub owner_id: Uuid,
    pub owner_first_name: String,
    pub owner_last_name: String,
    pub owner_patronymic: Option<String>,
    pub subject_id: Uuid,
    pub subject_name: String,
    pub subject_reserved_disk_bytes: i64,
    pub teacher_id: Uuid,
    pub teacher_first_name: String,
    pub teacher_last_name: String,
    pub teacher_patronymic: Option<String>,
    pub source_link: Option<String>,
    pub source_branch: Option<String>,
    pub source_root_dir: Option<String>,
    pub source_size_bytes: i64,
    pub database_id: Option<Uuid>,
    pub database_name: Option<String>,
    pub database_password: Option<String>,
    pub database_disk_usage_bytes: i64,
    pub other_projects_bytes: i64,
}

#[derive(Debug, Clone, FromRow)]
pub struct ProjectUserModel {
    pub id: Uuid,
    pub first_name: String,
    pub last_name: String,
    pub patronymic: Option<String>,
}

pub struct ProjectDetailsByUserQuery {
    pub user_id: Uuid,
    pub project_id: Uuid,
}

pub struct ProjectUsersByProjectQuery {
    pub project_id: Uuid,
}

impl SubjectProjectsByUserQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<Vec<SubjectProjectModel>>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as::<_, SubjectProjectModel>(
            "SELECT
                s.id AS subject_id,
                s.name AS subject_name,
                s.reserved_disk_bytes AS subject_reserved_disk_bytes,
                u.id AS teacher_id,
                u.first_name AS teacher_first_name,
                u.last_name AS teacher_last_name,
                u.patronymic AS teacher_patronymic,
                p.id AS project_id,
                p.name AS project_name,
                p.alias AS project_alias,
                COALESCE(ps.size_bytes, 0) AS project_file_usage_bytes,
                COALESCE(d.disk_usage_bytes, 0) AS project_database_usage_bytes
            FROM subjects s
            JOIN subject_groups sg ON sg.subject_id = s.id
            JOIN group_users gu ON gu.group_id = sg.group_id
            JOIN users u ON u.id = s.owner_id
            LEFT JOIN projects p ON p.subject_id = s.id
            LEFT JOIN project_sources ps ON ps.id = p.source_id
            LEFT JOIN databases d ON d.id = p.database_id
            WHERE gu.user_id = $1
            AND gu.group_id = $2
            AND ($3::UUID IS NULL OR s.id = $3)
            AND (
                $4::TEXT IS NULL
                OR s.name ILIKE '%' || $4 || '%'
                OR p.name ILIKE '%' || $4 || '%'
                OR p.alias ILIKE '%' || $4 || '%'
                OR concat_ws(' ', u.last_name, u.first_name, u.patronymic) ILIKE '%' || $4 || '%'
            )
            ORDER BY s.created_at DESC, p.created_at DESC",
        )
        .bind(self.user_id)
        .bind(self.group_id)
        .bind(self.subject_id)
        .bind(self.query)
        .fetch_all(conn)
        .await
        .context("failed to fetch")
    }
}

impl IsGroupAvailableForUserQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<bool>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_scalar(
            "SELECT EXISTS(
                SELECT 1
                FROM groups g
                JOIN group_users gu ON gu.group_id = g.id
                WHERE g.id = $1 AND gu.user_id = $2
            )",
        )
        .bind(self.group_id)
        .bind(self.user_id)
        .fetch_one(conn)
        .await
        .context("failed to check is group available for user")
    }
}

impl IsSubjectAvailableForGroupQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<bool>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_scalar(
            "SELECT EXISTS(
                SELECT 1
                FROM subject_groups sg
                WHERE sg.subject_id = $1 AND sg.group_id = $2
            )",
        )
        .bind(self.subject_id)
        .bind(self.group_id)
        .fetch_one(conn)
        .await
        .context("failed to check is subject available for group")
    }
}

impl<'a> IsProjectAliasExistsQuery<'a> {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<bool>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM projects WHERE alias = $1)")
            .bind(self.alias)
            .fetch_one(conn)
            .await
            .context("failed to check is project alias exists")
    }
}

impl ProjectDetailsByUserQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<Option<ProjectDetailsModel>>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as::<_, ProjectDetailsModel>(
            "SELECT
                p.id AS project_id,
                p.name AS project_name,
                p.alias AS project_alias,
                owner.id AS owner_id,
                owner.first_name AS owner_first_name,
                owner.last_name AS owner_last_name,
                owner.patronymic AS owner_patronymic,
                s.id AS subject_id,
                s.name AS subject_name,
                s.reserved_disk_bytes AS subject_reserved_disk_bytes,
                teacher.id AS teacher_id,
                teacher.first_name AS teacher_first_name,
                teacher.last_name AS teacher_last_name,
                teacher.patronymic AS teacher_patronymic,
                ps.link AS source_link,
                ps.branch AS source_branch,
                ps.root_dir AS source_root_dir,
                COALESCE(ps.size_bytes, 0) AS source_size_bytes,
                d.id AS database_id,
                d.name AS database_name,
                d.password AS database_password,
                COALESCE(d.disk_usage_bytes, 0) AS database_disk_usage_bytes,
                COALESCE((
                    SELECT SUM(COALESCE(ps2.size_bytes, 0) + COALESCE(d2.disk_usage_bytes, 0))::BIGINT
                    FROM projects p2
                    LEFT JOIN project_sources ps2 ON ps2.id = p2.source_id
                    LEFT JOIN databases d2 ON d2.id = p2.database_id
                    WHERE p2.subject_id = p.subject_id AND p2.id != p.id
                ), 0) AS other_projects_bytes
            FROM projects p
            JOIN subjects s ON s.id = p.subject_id
            JOIN users owner ON owner.id = p.owner_id
            JOIN users teacher ON teacher.id = s.owner_id
            JOIN subject_groups sg ON sg.subject_id = s.id
            JOIN group_users gu ON gu.group_id = sg.group_id
            LEFT JOIN project_sources ps ON ps.id = p.source_id
            LEFT JOIN databases d ON d.id = p.database_id
            WHERE p.id = $1 AND gu.user_id = $2
            LIMIT 1",
        )
        .bind(self.project_id)
        .bind(self.user_id)
        .fetch_optional(conn)
        .await
        .context("failed to fetch project details")
    }
}

impl ProjectUsersByProjectQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<Vec<ProjectUserModel>>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as::<_, ProjectUserModel>(
            "SELECT u.id, u.first_name, u.last_name, u.patronymic
            FROM project_users pu
            JOIN users u ON u.id = pu.user_id
            WHERE pu.project_id = $1 AND pu.is_accepted = TRUE
            ORDER BY pu.user_id",
        )
        .bind(self.project_id)
        .fetch_all(conn)
        .await
        .context("failed to fetch project users")
    }
}
