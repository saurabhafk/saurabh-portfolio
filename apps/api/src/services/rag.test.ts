import { describe, expect, it } from "vitest";
import { buildChatMessages, filterHits, UNKNOWN_REPLY } from "./rag.js";
import type { QueryHit } from "../lib/vector-store.js";

const hit = (url: string, score: number): QueryHit => ({
  score,
  chunk: {
    id: url,
    title: "FitTrack",
    url,
    sourceType: "project",
    text: "Uses Redux Toolkit",
  },
});

describe("filterHits", () => {
  it("drops hits below threshold", () => {
    const kept = filterHits(
      [hit("/projects/fittrack", 0.9), hit("/about", 0.1)],
      0.35
    );
    expect(kept).toHaveLength(1);
  });
});

describe("buildChatMessages", () => {
  it("includes chunk urls in system context", () => {
    const messages = buildChatMessages("Has Saurabh used Redux Toolkit?", [
      hit("/projects/fittrack", 0.9),
    ]);
    expect(messages[0]?.role).toBe("system");
    expect(messages[0]?.content).toContain("/projects/fittrack");
    expect(messages[1]?.content).toContain("Redux Toolkit");
  });
});

describe("UNKNOWN_REPLY", () => {
  it("points visitors to projects and skills", () => {
    expect(UNKNOWN_REPLY).toContain("/projects");
    expect(UNKNOWN_REPLY).toContain("/skills");
  });
});
