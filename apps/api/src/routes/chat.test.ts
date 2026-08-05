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
    chat: async (messages) => {
      const system = messages[0]?.content ?? "";
      if (system.includes("coverage checker")) return "YES";
      return "Yes — I've used Redux Toolkit in [FitTrack](/projects/fittrack).";
    },
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
      .send({ message: "Have you worked with redux toolkit?" });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain("FitTrack");
    expect(res.body.sources[0].url).toBe("/projects/fittrack");
  });

  it("returns contact fallback when coverage gate says NO", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "chat-"));
    const store = new VectorStore(path.join(dir, "index.json"));
    await store.rebuild(
      [
        {
          id: "p",
          title: "Ponteo",
          url: "/projects/ponteo",
          sourceType: "project",
          text: "Intercom for customer support",
        },
      ],
      async () => [1, 0]
    );

    const app = createApp({
      checkOllama: async () => true,
      ollama: mockOllama({
        chat: async (messages) => {
          const system = messages[0]?.content ?? "";
          if (system.includes("coverage checker")) return "NO";
          return "should not be called";
        },
      }),
      store,
      relevanceThreshold: 0.35,
      corsOrigins: ["http://localhost:3000"],
      reindexSecret: "secret",
      contentDir: dir,
    });

    const res = await request(app)
      .post("/api/chat")
      .send({ message: "how was security handled for intercom auth?" });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain("saurabhsri98@gmail.com");
    expect(res.body.sources).toEqual([]);
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
    expect(res.body.reply).toContain("saurabhsri98@gmail.com");
    expect(res.body.reply).toContain("linkedin.com/in/saurabhafk");
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
        chat: async (messages) => {
          const system = messages[0]?.content ?? "";
          if (system.includes("coverage checker")) return "YES";
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
