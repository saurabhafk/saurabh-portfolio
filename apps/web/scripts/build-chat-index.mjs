/**
 * Pre-build chat vector index for Vercel / production.
 * Requires GEMINI_API_KEY in env or apps/web/.env.local
 *
 * From repo root:
 *   npm run build -w @portfolio/content-core
 *   npm run build:index -w @portfolio/web
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildContentChunks,
  loadPortfolioContent,
} from "@portfolio/content-core";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(webRoot, "../..");
const contentDir = path.join(repoRoot, "content");
const indexFile = path.join(webRoot, "data/chat-index.json");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(webRoot, ".env.local"));
loadEnvFile(path.join(webRoot, ".env"));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is required to build the chat index");
  process.exit(1);
}

const embedModel = process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

async function embed(text) {
  const prompt = text.length > 8000 ? text.slice(0, 8000) : text;
  const res = await fetch(
    `${GEMINI_BASE}/${embedModel}:embedContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: `models/${embedModel}`,
        content: { parts: [{ text: prompt }] },
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`embed failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  const values = data.embedding?.values;
  if (!values?.length) throw new Error("empty embedding");
  return values;
}

const content = loadPortfolioContent(contentDir);
const chunks = buildContentChunks(content);
const items = [];
for (let i = 0; i < chunks.length; i++) {
  const chunk = chunks[i];
  process.stdout.write(`\rEmbedding ${i + 1}/${chunks.length}: ${chunk.id}    `);
  const embedding = await embed(chunk.text);
  items.push({ chunk, embedding });
}
process.stdout.write("\n");

fs.mkdirSync(path.dirname(indexFile), { recursive: true });
fs.writeFileSync(indexFile, JSON.stringify({ items }, null, 2));
console.log(`Wrote ${items.length} chunks → ${indexFile}`);
