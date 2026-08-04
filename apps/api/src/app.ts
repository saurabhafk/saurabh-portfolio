import cors from "cors";
import express from "express";
import type { OllamaClient } from "./lib/ollama.js";
import type { VectorStore } from "./lib/vector-store.js";
import { chatRouter } from "./routes/chat.js";
import { healthRouter } from "./routes/health.js";

export type AppDeps = {
  checkOllama: () => Promise<boolean>;
  ollama?: OllamaClient;
  store?: VectorStore;
  relevanceThreshold?: number;
  corsOrigins?: string[];
  reindexSecret?: string;
  contentDir?: string;
};

export function createApp(deps: AppDeps) {
  const app = express();
  app.use(express.json({ limit: "32kb" }));
  app.use(
    cors({
      origin: deps.corsOrigins ?? ["http://localhost:3000"],
    })
  );
  app.use(healthRouter(deps.checkOllama));

  if (deps.ollama && deps.store) {
    app.use(
      chatRouter({
        ollama: deps.ollama,
        store: deps.store,
        relevanceThreshold: deps.relevanceThreshold ?? 0.35,
      })
    );
  }

  return app;
}
