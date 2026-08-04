import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildContentChunks } from "./chunks.js";
import { loadPortfolioContent } from "./load.js";

const contentDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../content"
);

describe("buildContentChunks", () => {
  it("emits chunks with portfolio deep-link urls and searchable text", () => {
    const content = loadPortfolioContent(contentDir);
    const chunks = buildContentChunks(content);
    const urls = chunks.map((c) => c.url);

    expect(urls).toContain("/about");
    expect(urls).toContain("/projects/fittrack");
    expect(urls).toContain("/skills#redux-toolkit");
    expect(urls).toContain("/writing/redux-in-rn");
    expect(urls.some((u) => u.startsWith("/experience#"))).toBe(true);

    const fittrack = chunks.find((c) => c.url === "/projects/fittrack");
    expect(fittrack?.text.toLowerCase()).toContain("redux");
  });
});
