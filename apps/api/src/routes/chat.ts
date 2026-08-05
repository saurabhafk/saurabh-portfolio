import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import type { OllamaClient } from "../lib/ollama.js";
import type { VectorStore } from "../lib/vector-store.js";
import {
  UNKNOWN_REPLY,
  buildChatMessages,
  buildCoverageGateMessages,
  contextCoversQuestion,
  filterHits,
} from "../services/rag.js";

const bodySchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
});

export function chatRouter(opts: {
  ollama: OllamaClient;
  store: VectorStore;
  relevanceThreshold: number;
}) {
  const router = Router();

  const chatLimiter = rateLimit({
    windowMs: 60_000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
  });

  router.post("/api/chat", chatLimiter, async (req, res) => {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body" });
      return;
    }

    try {
      const embedding = await opts.ollama.embed(parsed.data.message);
      const hits = filterHits(
        opts.store.query(embedding, 5),
        opts.relevanceThreshold
      );

      if (hits.length === 0) {
        res.json({ reply: UNKNOWN_REPLY, sources: [] });
        return;
      }

      const gate = await opts.ollama.chat(
        buildCoverageGateMessages(parsed.data.message, hits)
      );
      if (!contextCoversQuestion(gate)) {
        res.json({ reply: UNKNOWN_REPLY, sources: [] });
        return;
      }

      const messages = buildChatMessages(parsed.data.message, hits);
      const reply = await opts.ollama.chat(messages);
      res.json({
        reply,
        sources: hits.map((h) => ({
          title: h.chunk.title,
          url: h.chunk.url,
        })),
      });
    } catch {
      res.status(503).json({ error: "Chat temporarily unavailable" });
    }
  });

  return router;
}
