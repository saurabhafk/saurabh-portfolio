# Deploy guide (free path)

## Production (recommended): Vercel + Gemini

| Piece | Host |
|-------|------|
| Site + `/api/chat` | **Vercel** (Hobby / free) |
| Embeddings + LLM | **Google Gemini** API (free tier) |
| Content | Repo `content/` (bundled at build) |

No VPS and no public Ollama required.

### 1. GitHub

Push the `dev` branch to GitHub.

### 2. Vercel project

1. Import the repo in [Vercel](https://vercel.com).
2. **Root Directory:** `apps/web`
3. Env vars (Production + Preview):

| Name | Value |
|------|--------|
| `GEMINI_API_KEY` | from [Google AI Studio](https://aistudio.google.com/apikey) |
| `GEMINI_EMBED_MODEL` | `gemini-embedding-001` |
| `GEMINI_CHAT_MODEL` | `gemini-2.0-flash` |
| `RELEVANCE_THRESHOLD` | `0.35` (optional) |

Leave `NEXT_PUBLIC_API_URL` **unset** so the chat widget calls same-origin `/api/chat`.

4. Deploy. Build runs `content-core` + chat index + `next build` (see `apps/web/vercel.json`).

### 3. Local with Gemini

```bash
cp apps/web/.env.example apps/web/.env.local
# set GEMINI_API_KEY
npm run build -w @portfolio/content-core
npm run build:index -w @portfolio/web   # optional; also runs on next build
npm run dev:web
```

### 4. Local with Express + Ollama (optional)

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000

npm run start -w @portfolio/api
npm run dev:web
```

---

## Alternate (paid): Vercel + VPS + Ollama

See older notes: Express API on a VPS with Ollama, `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`. Not required for the free MVP.
