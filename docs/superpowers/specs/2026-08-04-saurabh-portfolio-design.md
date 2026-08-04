# Saurabh Portfolio — Design Spec

**Date:** 2026-08-04  
**Status:** Approved for planning  
**Owner:** Saurabh

## Problem

Saurabh needs a personal portfolio that works for recruiters, freelance clients, and personal branding. Visitors should be able to ask natural-language questions (e.g. “Has Saurabh worked with Redux Toolkit?”) and get accurate answers with hyperlinks into the right portfolio sections—without inventing experience that isn’t on the site.

## Goals

- Showcase React Native work as the primary strength, while credibly signaling backend, API, frontend, and AI interest.
- Keep the portfolio itself as the source of truth; the chatbot only collates and deep-links existing content.
- Separate frontend and backend for a clear full-stack learning and hiring story.
- Run chat inference at zero API cost via Ollama on a VPS; host the frontend on Vercel.

## Non-goals (v1)

- Admin UI or headless CMS (files first; structure left ready for later expansion).
- Dedicated `/ask` page (floating widget only).
- Paid hosted LLM APIs in production.
- User accounts, persisted chat history, analytics dashboards, i18n.
- Invented or speculative career claims in chat responses.

## Positioning

- **Primary craft:** React Native app development.
- **Growth path:** Backend-heavy full-stack, API-focused, and AI-adjacent roles (also open to frontend).
- **Audiences:** Full-time hiring, freelance/contract, and general personal brand.

## Approach

**Content-indexed RAG:** Index the same markdown/JSON that powers the site. On each chat request, retrieve relevant chunks (with URLs), prompt Ollama to answer only from those chunks, and return markdown links into portfolio routes.

## Architecture

```
Visitor browser
  └── Next.js app (Vercel)
        ├── Static/SSR pages from content files in the repo
        └── Floating ChatWidget → HTTPS → Node API (VPS)
                                            ├── Content loader (same files / synced copy)
                                            ├── Vector index + local embeddings (Ollama)
                                            └── Chat completion (Ollama)
```

| Piece | Role | Host |
|-------|------|------|
| Next.js frontend | Portfolio pages, ChatWidget, link rendering | Vercel |
| Content files | Source of truth for site + RAG | Git repo (deployed with FE; copied/synced to API) |
| Node API | `/api/chat`, `/api/reindex`, `/api/health` | VPS |
| Ollama | Embeddings + chat model | Same VPS |

### Content sync to the API

The VPS must index the same content the site renders. v1 options (pick one in implementation plan):

1. **Monorepo shared `content/`** — API reads from a mounted/copied `content/` directory on deploy.
2. **Deploy hook** — After content merges, CI copies content to the VPS and calls `/api/reindex`.

Prefer (1) for simplicity in v1.

### Repo layout (v1)

```
/
  apps/
    web/          # Next.js (Vercel)
    api/          # Node API (VPS)
  content/        # Shared markdown + skills.json
  docs/
```

Both apps read from `content/`. On the VPS, deploy includes `apps/api` plus `content/`.

## Site map

| Route | Purpose |
|-------|---------|
| `/` | Hero + short positioning (RN-first, backend/AI path) |
| `/projects` | Project grid |
| `/projects/[slug]` | Case study / writeup |
| `/experience` | Roles, timeline, highlights |
| `/skills` | Tagged skills linked to projects |
| `/writing` | Posts / deep dives index |
| `/writing/[slug]` | Individual post |
| `/about` | Bio, focus areas, contact CTA |

Floating chat widget appears on every page. No dedicated chat route in v1.

## Content model

File-based, repo-owned. Suggested layout:

```
content/
  about.md
  skills.json
  projects/
    <slug>.md
  experience/
    <slug-or-id>.md
  writing/
    <slug>.md
```

### Frontmatter / fields

**Project (`projects/*.md`):**
- `title`, `slug`, `summary`, `stack[]` (canonical skill tags), `role`, `links` (repo/demo), `featured` (bool)
- Body: markdown with optional heading anchors for deep-links

**Experience (`experience/*.md`):**
- `company`, `title`, `start`, `end`, `summary`, `highlights[]`, `stack[]`

**Writing (`writing/*.md`):**
- `title`, `slug`, `summary`, `tags[]`, `publishedAt`
- Body: markdown

**Skills (`skills.json`):**
- Canonical list of skill tags with display names and optional `projectSlugs[]` / `writingSlugs[]` for high-confidence mapping

**About (`about.md`):**
- Bio and positioning copy used on `/about` and as RAG context

Chatbot chunks must each carry at least: `title`, `url` (portfolio path, optionally with hash), `sourceType`, `text`.

## Frontend components

- **Layout / nav** — brand, primary routes, contact CTA
- **Page templates** — home, project list/detail, experience, skills, writing list/detail, about
- **ChatWidget** — floating launcher + panel; message list; input; loading/error states; markdown renderer that turns relative portfolio links into Next.js navigations
- **Content rendering** — markdown/MDX pipeline shared for projects and writing

## Backend components

- **HTTP server** (Node — Express or Fastify; choose in plan) with CORS restricted to the Vercel origin
- **Content loader** — parse markdown + JSON into page data shapes and RAG chunks
- **Vector store** — local persistent index on the VPS (implementation choice in plan: e.g. LanceDB, SQLite-vss, or simple JSON + cosine over embeddings for small corpora)
- **Ollama client** — embeddings model + chat model
- **Routes:**
  - `POST /api/chat` — `{ message, history? }` → `{ reply, sources[] }`
  - `POST /api/reindex` — protected (shared secret header) rebuild of the index
  - `GET /api/health` — API + Ollama reachability

### Chat pipeline

1. Validate and rate-limit request (per IP).
2. Embed user message via Ollama.
3. Retrieve top-k chunks with metadata URLs.
4. If no chunks above a relevance threshold: return a fixed honest fallback (see Errors).
5. Otherwise prompt Ollama: answer only from provided chunks; include markdown links using the chunk URLs; do not invent experience.
6. Return reply + structured `sources[]` (title + url). The widget always shows source chips so visitors can navigate even if the model omits a markdown link.

## Error handling

| Condition | Behavior |
|-----------|----------|
| No relevant chunks | Reply that the info isn’t in the portfolio; suggest Projects / Skills; no fabricated claims |
| Ollama unreachable | `503` + widget “Chat temporarily unavailable”; portfolio pages still work |
| Rate limit exceeded | `429` with short retry guidance |
| Invalid body | `400` |
| Reindex without secret | `401` |

## Security (v1)

- CORS allowlist: production Vercel URL (+ localhost for dev).
- Rate limit `/api/chat`.
- Shared secret for `/api/reindex`.
- No secrets in the frontend; API base URL is public; Ollama bound to localhost on the VPS (not exposed to the internet).

## Testing

- **Content loader:** fixtures produce correct routes and chunk URLs.
- **Retrieval:** skill-oriented queries return expected project/skill links for fixture content.
- **Chat API:** Ollama mocked; assert response shape, fallbacks, and that reply includes expected link paths when chunks are provided.
- **Manual:** ask RN / Redux / backend questions in the widget and click through to the right pages.

## Success criteria

- A visitor can ask about a skill or project and get an answer grounded in content files.
- Successful retrieval responses expose working deep-links via reply markdown and/or `sources[]` chips in the widget.
- The portfolio remains fully usable if the chat API or Ollama is down.
- Deploy path is documented: Vercel (frontend) + VPS (Node + Ollama).

## Visual design

Visual brand (typography, color, motion, hero treatment) is not locked in this spec. It will be defined during frontend implementation under the project’s frontend design rules: brand-forward first viewport, no generic purple/cream AI defaults, expressive type, atmospheric background, full-bleed hero, minimal card use.

## Future expansion (not v1)

- Admin UI for editing content (then CMS).
- Dedicated `/ask` page in addition to the widget.
- Swap Ollama for a free-tier or paid hosted model without changing the content model.
- Stronger analytics on unanswered queries to improve content coverage.
