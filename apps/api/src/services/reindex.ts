import {
  buildContentChunks,
  loadPortfolioContent,
} from "@portfolio/content-core";
import type { OllamaClient } from "../lib/ollama.js";
import type { VectorStore } from "../lib/vector-store.js";

export async function reindexFromContentDir(
  contentDir: string,
  store: VectorStore,
  ollama: OllamaClient
) {
  const content = loadPortfolioContent(contentDir);
  const chunks = buildContentChunks(content);
  await store.rebuild(chunks, (text) => ollama.embed(text));
  return { chunkCount: chunks.length };
}
