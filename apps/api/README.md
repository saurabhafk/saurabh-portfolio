# @portfolio/api

Express API for portfolio chat (RAG over `content/` via Ollama).

## Layout

```
src/
  index.ts      # process entry
  app.ts        # Express factory (tests use this)
  config/       # env → config
  routes/       # HTTP adapters
  services/     # RAG + reindex logic
  lib/          # Ollama client, vector store
data/           # runtime index.json (gitignored)
```

## Run

```bash
# from repo root
cp apps/api/.env.example apps/api/.env   # once
npm run build -w @portfolio/content-core
npm run build -w @portfolio/api
npm run start -w @portfolio/api
```

Health: `GET http://localhost:4000/api/health`

See [docs/guide/HOW_IT_WORKS.md](../../docs/guide/HOW_IT_WORKS.md).
