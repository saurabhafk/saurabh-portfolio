import { afterEach, describe, expect, it, vi } from "vitest";
import { createOllamaClient } from "./ollama.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createOllamaClient", () => {
  it("embeds text via /api/embeddings", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ embedding: [0.1, 0.2, 0.3] }),
      }))
    );
    const client = createOllamaClient({
      baseUrl: "http://ollama.test",
      embedModel: "nomic-embed-text",
      chatModel: "llama3.2",
    });
    const vec = await client.embed("redux toolkit");
    expect(vec).toEqual([0.1, 0.2, 0.3]);
    expect(fetch).toHaveBeenCalled();
  });

  it("chats via /api/chat", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          message: { content: "Yes — see [FitTrack](/projects/fittrack)." },
        }),
      }))
    );
    const client = createOllamaClient({
      baseUrl: "http://ollama.test",
      embedModel: "nomic-embed-text",
      chatModel: "llama3.2",
    });
    const reply = await client.chat([
      { role: "system", content: "Be helpful" },
      { role: "user", content: "Redux?" },
    ]);
    expect(reply).toContain("FitTrack");
  });
});
