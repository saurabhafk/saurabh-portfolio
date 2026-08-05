# @portfolio/web

Next.js (App Router) portfolio UI + floating chat widget.

## Layout

```
src/
  app/                 # routes → URLs
  components/<domain>/ # chat, layout, icons, content, …
  lib/                 # content loader, chat API client, tech icons
public/                # static assets
```

## Run

```bash
# from repo root
cp apps/web/.env.example apps/web/.env.local   # once
npm run build -w @portfolio/content-core
npm run dev:web
```

Site: http://localhost:3000  
Chat needs the API on `:4000` (see `apps/api`).

See [docs/guide/HOW_IT_WORKS.md](../../docs/guide/HOW_IT_WORKS.md).
