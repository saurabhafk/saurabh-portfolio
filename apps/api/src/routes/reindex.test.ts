import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import type { OllamaClient } from "../lib/ollama.js";
import { VectorStore } from "../lib/vector-store.js";

function mockOllama(): OllamaClient {
  return {
    isReachable: async () => true,
    embed: async () => [1, 0],
    chat: async () => "",
  };
}

function setupContentDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "re-"));
  fs.writeFileSync(
    path.join(dir, "about.md"),
    "---\ntitle: About\n---\nHi\n"
  );
  fs.writeFileSync(
    path.join(dir, "skills.json"),
    JSON.stringify({ skills: [] })
  );
  for (const sub of ["projects", "experience", "writing"]) {
    fs.mkdirSync(path.join(dir, sub));
  }
  return dir;
}

describe("POST /api/reindex", () => {
  it("rejects missing secret", async () => {
    const dir = setupContentDir();
    const store = new VectorStore(path.join(dir, "index.json"));
    const app = createApp({
      checkOllama: async () => true,
      ollama: mockOllama(),
      store,
      contentDir: dir,
      reindexSecret: "secret",
      corsOrigins: ["http://localhost:3000"],
    });

    const res = await request(app).post("/api/reindex");
    expect(res.status).toBe(401);
  });

  it("rebuilds index with valid secret", async () => {
    const dir = setupContentDir();
    const store = new VectorStore(path.join(dir, "index.json"));
    const app = createApp({
      checkOllama: async () => true,
      ollama: mockOllama(),
      store,
      contentDir: dir,
      reindexSecret: "secret",
      corsOrigins: ["http://localhost:3000"],
    });

    const res = await request(app)
      .post("/api/reindex")
      .set("x-reindex-secret", "secret");
    expect(res.status).toBe(200);
    expect(res.body.chunkCount).toBeGreaterThanOrEqual(1);
  });
});
