import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import type { OllamaClient } from "../lib/ollama.js";
import { VectorStore } from "../lib/vector-store.js";

function mockOllama(overrides: Partial<OllamaClient> = {}): OllamaClient {
  return {
    isReachable: async () => true,
    embed: async () => [1, 0],
    chat: async () =>
      "Yes. Saurabh used Redux Toolkit in [FitTrack](/projects/fittrack).",
    ...overrides,
  };
}

describe("POST /api/chat", () => {
  it("returns reply and sources for relevant query", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "chat-"));
    const store = new VectorStore(path.join(dir, "index.json"));
    await store.rebuild(
      [
        {
          id: "p",
          title: "FitTrack",
          url: "/projects/fittrack",
          sourceType: "project",
          text: "Redux Toolkit",
        },
      ],
      async () => [1, 0]
    );

    const app = createApp({
      checkOllama: async () => true,
      ollama: mockOllama(),
      store,
      relevanceThreshold: 0.35,
      corsOrigins: ["http://localhost:3000"],
      reindexSecret: "secret",
      contentDir: dir,
    });

    const res = await request(app)
      .post("/api/chat")
      .send({ message: "Has Saurabh worked with redux toolkit?" });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain("FitTrack");
    expect(res.body.sources[0].url).toBe("/projects/fittrack");
  });

  it("returns unknown fallback when nothing is relevant", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "chat-"));
    const store = new VectorStore(path.join(dir, "index.json"));
    await store.rebuild(
      [
        {
          id: "p",
          title: "FitTrack",
          url: "/projects/fittrack",
          sourceType: "project",
          text: "Redux Toolkit",
        },
      ],
      async () => [0, 1]
    );

    const app = createApp({
      checkOllama: async () => true,
      ollama: mockOllama({
        embed: async () => [1, 0],
        chat: async () => "should not be called",
      }),
      store,
      relevanceThreshold: 0.95,
      corsOrigins: ["http://localhost:3000"],
      reindexSecret: "secret",
      contentDir: dir,
    });

    const res = await request(app)
      .post("/api/chat")
      .send({ message: "totally unrelated topic xyz" });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain("/projects");
    expect(res.body.sources).toEqual([]);
  });

  it("returns 503 when ollama chat throws", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "chat-"));
    const store = new VectorStore(path.join(dir, "index.json"));
    await store.rebuild(
      [
        {
          id: "p",
          title: "FitTrack",
          url: "/projects/fittrack",
          sourceType: "project",
          text: "Redux Toolkit",
        },
      ],
      async () => [1, 0]
    );

    const app = createApp({
      checkOllama: async () => true,
      ollama: mockOllama({
        chat: async () => {
          throw new Error("down");
        },
      }),
      store,
      relevanceThreshold: 0.35,
      corsOrigins: ["http://localhost:3000"],
      reindexSecret: "secret",
      contentDir: dir,
    });

    const res = await request(app).post("/api/chat").send({ message: "redux" });
    expect(res.status).toBe(503);
  });
});
