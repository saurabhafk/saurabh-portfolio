# Saurabh Portfolio

Personal portfolio (Next.js) with a floating RAG chatbot backed by Express + Ollama. Answers stay grounded in `content/`; undocumented details fall back to contact info.

## Stack

| Piece | Path | Role |
|-------|------|------|
| Web | `apps/web` | Next.js UI |
| API | `apps/api` | Chat / health / reindex |
| Shared lib | `packages/content-core` | Load content + build RAG chunks |
| Content | `content/` | Projects, skills, experience, writing |

## Requirements

- Node.js 22+ (`.nvmrc`)
- Ollama with `nomic-embed-text` and `llama3.2` for local chat

## Quick start

```bash
npm install
npm run build -w @portfolio/content-core

cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# Terminal 1 — API (Ollama must be running)
npm run start -w @portfolio/api

# Terminal 2 — Web
npm run dev:web
```

- Site: http://localhost:3000  
- Health: http://localhost:4000/api/health  

## Learn the system

**Read this first:** [docs/guide/HOW_IT_WORKS.md](docs/guide/HOW_IT_WORKS.md) — folder map, Next.js, Express, embeddings, RAG, coverage gate, and what to edit for what change.

| Doc | Purpose |
|-----|---------|
| [docs/guide/](docs/guide/) | Beginner guides |
| [docs/deploy.md](docs/deploy.md) | Hosting later (Vercel + VPS) |
| [docs/superpowers/specs/](docs/superpowers/specs/) | MVP design history |

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev:web` | Next.js dev server |
| `npm run dev:api` | Express API with watch |
| `npm run start -w @portfolio/api` | Run compiled API |
| `npm test` | content-core + api tests |
| `npm run build` | Build content-core, api, and web |

## Layout

```
apps/web                 Next.js portfolio + ChatWidget
apps/api                 Express RAG API
packages/content-core    Shared loader + chunk builder
content/                 Source of truth for site + chatbot
docs/guide/              How everything works
```
