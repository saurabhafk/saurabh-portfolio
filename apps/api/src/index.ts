import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import { loadConfig } from "./config/env.js";
import { createOllamaClient } from "./lib/ollama.js";
import { VectorStore } from "./lib/vector-store.js";
import { reindexFromContentDir } from "./services/reindex.js";

const apiDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(apiDir, "../../..");

const config = loadConfig({
  ...process.env,
  CONTENT_DIR: process.env.CONTENT_DIR ?? path.join(root, "content"),
  INDEX_PATH:
    process.env.INDEX_PATH ?? path.join(apiDir, "../data/index.json"),
});

const ollama = createOllamaClient({
  baseUrl: config.ollamaUrl,
  embedModel: config.embedModel,
  chatModel: config.chatModel,
});
const store = new VectorStore(config.indexPath);

const app = createApp({
  checkOllama: () => ollama.isReachable(),
  ollama,
  store,
  relevanceThreshold: config.relevanceThreshold,
  corsOrigins: config.corsOrigins,
  reindexSecret: config.reindexSecret,
  contentDir: config.contentDir,
});

app.listen(config.port, async () => {
  console.log(`API listening on :${config.port}`);
  try {
    if (await ollama.isReachable()) {
      const result = await reindexFromContentDir(
        config.contentDir,
        store,
        ollama
      );
      console.log(`Indexed ${result.chunkCount} chunks`);
    } else {
      console.warn("Ollama not reachable; skipping startup reindex");
    }
  } catch (err) {
    console.warn("Startup reindex failed", err);
  }
});
