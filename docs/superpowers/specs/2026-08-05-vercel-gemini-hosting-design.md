# Design: free Vercel hosting with Gemini chat

## Decision

Option 2 / Approach 2: single Vercel deploy for Next.js UI + `/api/chat`.
Gemini free API for embeddings + chat. No VPS / no public Ollama.

## Branching

- Work lives on `dev`
- `main` left unchanged

## Secrets

- `GEMINI_API_KEY` only in `apps/web/.env.local` (gitignored) and Vercel project env
- Never commit API keys
