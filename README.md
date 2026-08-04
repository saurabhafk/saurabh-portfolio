# Saurabh Portfolio

Personal portfolio with a floating RAG chatbot. Visitors can ask questions like “Has Saurabh worked with Redux Toolkit?” and get answers with deep-links into projects, skills, experience, and writing.

## Stack

- **Web:** Next.js (App Router) on Vercel — `apps/web`
- **API:** Express + Ollama RAG on a VPS — `apps/api`
- **Shared content:** markdown/JSON — `content/`
- **Shared package:** `@portfolio/content-core` — `packages/content-core`

## Requirements

- Node.js 22+ (`.nvmrc`)
- Ollama with `nomic-embed-text` and `llama3.2` for local chat

## Quick start

```bash
npm install
npm run build -w @portfolio/content-core

# API (needs Ollama running)
cp apps/api/.env.example apps/api/.env
npm run dev:api

# Web
cp apps/web/.env.example apps/web/.env.local
npm run dev:web
```

- Site: http://localhost:3000  
- Health: http://localhost:4000/api/health  

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev:web` | Next.js dev server |
| `npm run dev:api` | Express API with watch |
| `npm test` | content-core + api Vitest suites |
| `npm run build` | Build content-core, api, and web |

## Docs

- Design: `docs/superpowers/specs/2026-08-04-saurabh-portfolio-design.md`
- Plan: `docs/superpowers/plans/2026-08-04-saurabh-portfolio.md`
- Deploy: `docs/deploy.md`

## Layout

```
apps/web          Next.js portfolio + ChatWidget
apps/api          Express RAG API
packages/content-core   Shared loader + chunk builder
content/          Source of truth for site + chatbot
```
