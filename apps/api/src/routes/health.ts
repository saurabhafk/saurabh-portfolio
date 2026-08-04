import { Router } from "express";

export function healthRouter(checkOllama: () => Promise<boolean>) {
  const router = Router();
  router.get("/api/health", async (_req, res) => {
    const ollama = await checkOllama();
    res.json({ ok: true, ollama });
  });
  return router;
}
