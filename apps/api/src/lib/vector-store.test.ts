import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { ContentChunk } from "@portfolio/content-core";
import { VectorStore, cosineSimilarity } from "./vector-store.js";

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
  });
});

describe("VectorStore", () => {
  it("upserts chunks and retrieves by similarity", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "vs-"));
    const indexPath = path.join(dir, "index.json");
    const store = new VectorStore(indexPath);

    const chunks: ContentChunk[] = [
      {
        id: "a",
        title: "FitTrack",
        url: "/projects/fittrack",
        sourceType: "project",
        text: "Redux Toolkit state management",
      },
      {
        id: "b",
        title: "About",
        url: "/about",
        sourceType: "about",
        text: "Coffee brewing hobby",
      },
    ];

    await store.rebuild(chunks, async (text) => {
      if (text.toLowerCase().includes("redux")) return [1, 0];
      return [0, 1];
    });

    const hits = store.query([1, 0], 2);
    expect(hits[0]?.chunk.url).toBe("/projects/fittrack");
    expect(hits[0]?.score).toBeGreaterThan(0.9);
  });
});
