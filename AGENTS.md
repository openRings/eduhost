# Eduhost Agent Guide

This guide defines how an agent must work in this repository.
Main principle: follow existing project style and architecture, do not invent a parallel one.

## 1) General

### 1.1 Scope

- This repository has two main code areas:

1. `frontend` (SolidJS + TypeScript)
2. `backend` (Rust + Axum + sqlx)

- Agent decisions must respect layer boundaries in each area.

### 1.2 Global rules

- Prefer consistency with neighboring files over generic external conventions.
- Keep code changes minimal and local to the task.
- Do not add new abstraction layers unless the current architecture is clearly insufficient.
- Do not hardcode speculative business assumptions.
- Do not invent API contracts if they are not present in the codebase.

### 1.3 Layer discipline

- Put code in the proper layer; do not mix concerns.
- Reuse existing utilities/components/services before creating new ones.
- If the same pattern already exists nearby, copy that pattern.

### 1.4 Naming and style continuity

- Preserve naming style already used in each area.
- Preserve formatting conventions and import ordering style from nearby files.
- If a file/module has a specific style, continue in that style for edits in that file/module.

## 2) Frontend (SolidJS)

### 2.1 Stack

- `solid-js`, `@solidjs/router`
- `@ark-ui/solid`
- Tailwind v4 + `clsx` + `tailwind-merge`
- `zod`
- `lucide-solid`

### 2.2 Frontend architecture

- `src/shared`: small reusable composition pieces (`Section`, `Block`, `Field`, `Form`)
- `src/shared/uikit`: low-level reusable UI atoms (`Button`, `Input`, `Select`, `Label`)
- `src/components`: larger shared UI components (`Header`, `Footer`, `Notification`)
- `src/features`: feature-level UI slices (example: notifications host)
- `src/entities`: domain-facing types + fetch functions
- `src/utils`: technical utilities (`api`, `auth`, `clipboard`, notifications helpers)
- `src/pages`: route pages; mostly composition
- For page sections (e.g., account summary, navigation, subjects), place data loading + layout in `src/features` and put per-card UI in `src/components`.

### 2.3 Canonical component pattern

Use the established pattern:

- class constants (`baseClass`, `variantClass`, `sizeClass`)
- `splitProps` with `const [_, attrs] = ...`
- class composition with `twMerge(clsx(...))`
- Ark/HTML props typing with `HTMLArkProps<...>`
- Keep class constants close to the component/helper that uses them, but outside the component body; prefer placing them immediately above the related component/helper instead of collecting them at the top of the file.

```tsx
import { ark, HTMLArkProps } from "@ark-ui/solid";
import { splitProps } from "solid-js";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const baseClass = "transition-colors duration-150";
const sizeClass = {
  sm: "h-6 px-sm",
  md: "h-8 px-md",
};

export type ExampleProps = HTMLArkProps<"input"> & {
  size?: keyof typeof sizeClass;
};

export function Example(props: ExampleProps) {
  const [_, attrs] = splitProps(props, ["size", "class"]);

  const classes = () =>
    twMerge(clsx(baseClass, sizeClass[props.size ?? "md"], props.class));

  return <ark.input {...attrs} class={classes()} />;
}
```

### 2.4 Solid patterns to preserve

- Use `Show` for conditional blocks.
- Use `For` for list rendering.
- Use `createSignal` for local UI state.
- Use `createResource` + `Suspense` for async rendering where already used.
- Keep event naming style consistent with existing code (`onclick`, `oninput`, `onchange`, `onselect`, etc.).

### 2.5 Types and props

- Use `export type` for exported types.
- Follow existing union-props style for polymorphic components.
- `Omit<...>` and pragmatic narrowing are acceptable when matching local code style.

Example:

```tsx
export type BaseButtonProps = {
  variant?: "default" | "accent";
  isPending?: boolean;
};

export type ButtonProps =
  | (HTMLArkProps<"button"> & BaseButtonProps)
  | ({ href: string } & BaseButtonProps);
```

### 2.6 Forms and validation

- Use `shared/Form.tsx` + `createForm` + `zod` schema.
- Prefer `Form.Field`, `Form.Clear`, `Form.Submit` composition.
- Keep `shared/uikit/Input` visually simple: no embedded action buttons inside `Input`.
- For field-level actions (copy, show password, clear next to field, etc.), compose them at `shared/Field` level with `Field.Control` + `Field.Button`.
- Keep form submit logic in page/feature level, transport in `utils/api.ts`, domain-level data functions in `entities`.

### 2.7 UI styling conventions

- Use long Tailwind utility strings as used in project.
- Store reusable class groups in constants.
- Keep project tokens and state selectors (`group-hover`, `data-[...]`, `[&:has(...)]`, etc.).
- Always merge classes with `twMerge` when combining dynamic class sets.
- For loading placeholders in UI (dropdowns, lists, cards), prefer `Skeleton` components instead of text labels like "Загрузка...".

## 3) Backend (Rust)

### 3.1 Stack

- Rust
- Axum
- sqlx
- PostgreSQL
- anyhow + context-rich errors

### 3.2 Backend architecture

Current backend structure is explicit and should be preserved:

- route modules expose `routes()` and handlers
- per-domain submodules: `dtos`, `queries`, `commands`, `service`
- service layer contains business logic
- query/command objects encapsulate SQL actions with `execute(...)`
- shared cross-cutting modules in `backend/src` (`error`, `session`, `group_id`, `service`, `normalize`, `crypto`, `database`)

### 3.3 Route/handler style

- Keep route registration centralized in `routes()`.
- Use typed extractors (`WithService<T>`, `Session<...>`, `NormalizedJson<T>`).
- For group-scoped GET endpoints, prefer shared `GroupId` extractor over manual `groupId` parsing in handlers.
- Return `EndpointResult<impl IntoResponse>` where this pattern is used.
- Keep handlers thin; delegate business logic to service layer.

### 3.4 Service style

- Service struct holds `PgPool` and implements `Service` trait.
- Service methods perform orchestration, authorization decisions, and business checks.
- Add context to fallible operations via `with_context`/`context`.
- Keep DB primitives in query/command layer, not inline in handlers.

### 3.5 Query/command style

- One object per query/command with explicit fields.
- Expose `execute<'c, E>(self, conn: E)` with `E: PgExecutor<'c>`.
- Attach concise failure context (`context("failed to ...")`).
- Keep SQL readable and consistent with existing multiline style.

Example:

```rust
pub struct ProfileQuery {
    pub user_id: Uuid,
}

impl ProfileQuery {
    pub async fn execute<'c, E>(self, conn: E) -> anyhow::Result<Option<ProfileModel>>
    where
        E: PgExecutor<'c>,
    {
        sqlx::query_as::<_, ProfileModel>(
            "SELECT username, first_name, last_name, patronymic FROM users
            WHERE id = $1",
        )
        .bind(self.user_id)
        .fetch_optional(conn)
        .await
        .context("failed to fetch")
    }
}
```

### 3.6 DTO and normalization style

- Use `serde` DTOs with `#[serde(rename_all = "camelCase")]` where applicable.
- Keep validation/normalization in `Normalize` implementations for request DTOs.
- Keep response mapping in DTO constructors (`from_model(...)`) when pattern exists.

### 3.7 Error and auth/session conventions

- Reuse `EndpointError` and `EndpointResult` conventions.
- Keep HTTP status handling consistent with existing endpoint behavior.
- Reuse session/auth helpers and extractor patterns instead of duplicating token parsing logic.

### 3.8 Rust code ordering

- Declare structs/enums first.
- Then place inherent `impl` blocks.
- Place `impl Trait for Type` blocks after inherent `impl` blocks.
- In every Rust file, keep imports ordered by source:
  1. external imports (`std`, `core`, `anyhow`, `axum`, `eduhost`, `sqlx`, etc.)
  2. one empty line
  3. local imports from this package (`crate::...`, `self::...`).

## 4) AGENTS.md Maintenance Policy

This section is mandatory for future agent behavior.

### 4.1 Keep this file up to date

When the repository style or architecture changes, the agent must update this file in the same task (or immediately after), including:

- adding new rules for new patterns/layers/modules
- editing outdated rules that no longer match the codebase
- removing rules that became obsolete

### 4.2 Drift detection checklist

Before finalizing non-trivial changes, the agent should check if any of the following changed:

- new architectural layer or folder responsibility
- new canonical coding pattern repeated in multiple files
- renamed/deprecated modules or conventions
- major style shift in frontend or backend

If yes, update `AGENTS.md` accordingly.

### 4.3 Update quality rules

- Do not add speculative rules; document only patterns present in code.
- Prefer concrete, reusable examples over abstract statements.
- Keep guidance implementation-oriented and concise.
- Preserve separation: `General` vs `Frontend` vs `Backend`.

### 4.4 Safe cleanup rules

If a rule is obsolete:

- remove it or mark replacement clearly
- ensure no contradictions remain in this file
- keep examples aligned with current code style

## 5) Quick pre-merge checklist

- Correct layer placement for every new/changed file.
- Style matches neighboring files.
- No duplicated logic if an existing utility/service/component already solves it.
- Frontend follows Solid + UI kit patterns from this guide.
- Backend follows route/service/query/command/DTO boundaries from this guide.
- `AGENTS.md` reviewed for drift and updated if needed.
- Backend changes: run `cargo check`, `cargo clippy`, `cargo fmt`.
- Frontend changes: run `pnpm format`.
