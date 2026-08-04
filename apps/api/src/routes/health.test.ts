import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";

describe("GET /api/health", () => {
  it("returns ok when ollama check passes", async () => {
    const app = createApp({
      checkOllama: async () => true,
    });
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, ollama: true });
  });

  it("reports ollama false when check fails", async () => {
    const app = createApp({
      checkOllama: async () => false,
    });
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.ollama).toBe(false);
  });
});
