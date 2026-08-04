# Deploy guide

## Overview

| Piece | Host |
|-------|------|
| `apps/web` (Next.js) | Vercel |
| `apps/api` (Express) + Ollama | VPS |
| `content/` | Same git repo; copied with the API deploy |

## Prerequisites

- Node.js 22+ (see `.nvmrc`)
- Ollama on the VPS with models:
  ```bash
  ollama pull nomic-embed-text
  ollama pull llama3.2
  ```

## VPS — API + Ollama

1. Clone the repo and install:
   ```bash
   git clone <repo-url> portfolio && cd portfolio
   npm install
   npm run build -w @portfolio/content-core
   npm run build -w @portfolio/api
   ```

2. Create `apps/api/.env` from `.env.example`:
   ```bash
   PORT=4000
   CONTENT_DIR=/absolute/path/to/portfolio/content
   CORS_ORIGINS=https://your-frontend.vercel.app
   REINDEX_SECRET=<long-random-secret>
   OLLAMA_URL=http://127.0.0.1:11434
   EMBED_MODEL=nomic-embed-text
   CHAT_MODEL=llama3.2
   INDEX_PATH=/absolute/path/to/portfolio/apps/api/data/index.json
   RELEVANCE_THRESHOLD=0.35
   ```

3. Keep Ollama bound to localhost only. Put the API behind nginx/Caddy with HTTPS.

4. Run with systemd or PM2:
   ```bash
   npm run start -w @portfolio/api
   ```
   On startup the API reindexes content when Ollama is reachable.

5. After content updates on the VPS:
   ```bash
   curl -X POST https://api.yourdomain.com/api/reindex \
     -H "x-reindex-secret: $REINDEX_SECRET"
   ```

## Vercel — frontend

1. Import the monorepo; set the app root / project to `apps/web` (or configure root build commands).
2. Environment:
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```
3. Build command (from repo root if needed):
   ```bash
   npm install && npm run build -w @portfolio/content-core && npm run build -w @portfolio/web
   ```
4. Ensure the Vercel build can read `../../content` relative to `apps/web` (monorepo checkout includes `content/`).

## Local development

```bash
# terminal A — Ollama must be running locally
npm run dev -w @portfolio/api

# terminal B
cp apps/web/.env.example apps/web/.env.local
npm run dev -w @portfolio/web
```

Open http://localhost:3000 and use the Ask widget.
