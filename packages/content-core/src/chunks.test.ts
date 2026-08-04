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
    expect(urls).toContain("/projects/loginext-dispatcher");
    expect(urls).toContain("/skills#redux-toolkit");
    expect(urls).toContain("/writing/rn-state-with-rtk");
    expect(urls.some((u) => u.startsWith("/experience#"))).toBe(true);

    const loginext = chunks.find((c) => c.url === "/projects/loginext-dispatcher");
    expect(loginext?.text.toLowerCase()).toContain("redux");
  });
});
