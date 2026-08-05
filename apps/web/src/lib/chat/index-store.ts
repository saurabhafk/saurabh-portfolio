import fs from "node:fs";
import path from "node:path";
import {
  buildContentChunks,
  loadPortfolioContent,
} from "@portfolio/content-core";
import { createGeminiClient } from "./gemini";
import type { IndexedChunk } from "./types";

function contentDir(): string {
  // apps/web → repo content/
  return path.resolve(process.cwd(), "../../content");
}

function indexPath(): string {
  return path.resolve(process.cwd(), "data/chat-index.json");
}

let memory: IndexedChunk[] | null = null;

export function getIndexPath(): string {
  return indexPath();
}

export async function loadOrBuildIndex(): Promise<IndexedChunk[]> {
  if (memory) return memory;

  const file = indexPath();
  if (fs.existsSync(file)) {
    const raw = JSON.parse(fs.readFileSync(file, "utf8")) as {
      items: IndexedChunk[];
    };
    if (raw.items?.length) {
      memory = raw.items;
      return memory;
    }
  }

  // Build on the fly (local/dev); production should prebuild via npm run build:index
  const gemini = createGeminiClient();
  const content = loadPortfolioContent(contentDir());
  const chunks = buildContentChunks(content);
  const items: IndexedChunk[] = [];
  for (const chunk of chunks) {
    const embedding = await gemini.embed(chunk.text);
    items.push({ chunk, embedding });
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ items }, null, 2));
  memory = items;
  return memory;
}

export async function buildIndexToDisk(): Promise<number> {
  const gemini = createGeminiClient();
  const content = loadPortfolioContent(contentDir());
  const chunks = buildContentChunks(content);
  const items: IndexedChunk[] = [];
  for (const chunk of chunks) {
    const embedding = await gemini.embed(chunk.text);
    items.push({ chunk, embedding });
  }
  const file = indexPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ items }, null, 2));
  memory = items;
  return items.length;
}
