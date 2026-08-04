import { Router } from "express";
import type { OllamaClient } from "../lib/ollama.js";
import type { VectorStore } from "../lib/vector-store.js";
import { reindexFromContentDir } from "../services/reindex.js";

export function reindexRouter(opts: {
  contentDir: string;
  store: VectorStore;
  ollama: OllamaClient;
  secret: string;
}) {
  const router = Router();

  router.post("/api/reindex", async (req, res) => {
    if (req.header("x-reindex-secret") !== opts.secret) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const result = await reindexFromContentDir(
        opts.contentDir,
        opts.store,
        opts.ollama
      );
      res.json(result);
    } catch {
      res.status(500).json({ error: "Reindex failed" });
    }
  });

  return router;
}
