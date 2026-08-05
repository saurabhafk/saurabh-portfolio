# Design: production-style monorepo cleanup + beginner guide

## Decision

Approach 1 — keep npm workspaces (`apps/*`, `packages/*`, `content/`), harden conventions, add `docs/guide/HOW_IT_WORKS.md`. Defer Turborepo until hosting/CI needs it.

## Layout (target)

```
apps/web/          Next.js App Router UI
apps/api/          Express RAG API
packages/content-core/   Shared content loader + chunk builder
content/           Portfolio source of truth (md/json)
docs/guide/        Human guides (start here)
docs/deploy.md     Hosting notes (later)
docs/superpowers/  Specs/plans history
```

## Cleanup

- Remove stale `.gitkeep` files
- Remove empty `apps/api/src/middleware/` until real middleware exists
- Root `README.md` stays short; deep explanation in the guide

## Web conventions (`apps/web/src`)

| Path | Role |
|------|------|
| `app/` | Routes only (App Router pages/layouts) |
| `components/<domain>/` | UI by domain (`chat`, `layout`, `icons`, …) |
| `lib/` | Non-UI helpers (content load, API client, icon maps) |

## API conventions (`apps/api/src`)

| Path | Role |
|------|------|
| `index.ts` | Process entry: config, listen, startup reindex |
| `app.ts` | Express app factory (testable) |
| `config/` | Env → typed config |
| `routes/` | HTTP adapters (validate, call services) |
| `services/` | Business logic (RAG, reindex) |
| `lib/` | Infrastructure clients (Ollama, vector store) |

## Guide

`docs/guide/HOW_IT_WORKS.md` — beginner deep-dive: monorepo, Next, Express, content pipeline, embeddings, RAG, coverage gate, contact fallback, local run, what to edit for what change.
