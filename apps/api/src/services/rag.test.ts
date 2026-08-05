import { describe, expect, it } from "vitest";
import {
  buildChatMessages,
  buildCoverageGateMessages,
  contextCoversQuestion,
  filterHits,
  UNKNOWN_REPLY,
} from "./rag.js";
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
  it("includes chunk urls and contact fallback rules in system context", () => {
    const messages = buildChatMessages("Have you used Redux Toolkit?", [
      hit("/projects/fittrack", 0.9),
    ]);
    expect(messages[0]?.role).toBe("system");
    expect(messages[0]?.content).toContain("first person");
    expect(messages[0]?.content).toContain("/projects/fittrack");
    expect(messages[0]?.content).toContain(UNKNOWN_REPLY);
    expect(messages[0]?.content).toContain("does not specifically answer");
    expect(messages[1]?.content).toContain("Redux Toolkit");
  });
});

describe("contextCoversQuestion", () => {
  it("accepts YES and rejects NO or unclear replies", () => {
    expect(contextCoversQuestion("YES")).toBe(true);
    expect(contextCoversQuestion("yes — enough detail")).toBe(true);
    expect(contextCoversQuestion("NO")).toBe(false);
    expect(contextCoversQuestion("Maybe")).toBe(false);
  });
});

describe("buildCoverageGateMessages", () => {
  it("asks for a strict YES/NO coverage check", () => {
    const messages = buildCoverageGateMessages(
      "how was security handled for intercom auth?",
      [hit("/skills#intercom", 0.9)]
    );
    expect(messages[0]?.content).toContain("YES or NO");
    expect(messages[0]?.content).toContain("Intercom auth/security");
    expect(messages[1]?.content).toContain("intercom auth");
  });
});

describe("UNKNOWN_REPLY", () => {
  it("points visitors to contact channels and browse links", () => {
    expect(UNKNOWN_REPLY).toContain("saurabhsri98@gmail.com");
    expect(UNKNOWN_REPLY).toContain("linkedin.com/in/saurabhafk");
    expect(UNKNOWN_REPLY).toContain("+91 8574131772");
    expect(UNKNOWN_REPLY).toContain("/projects");
    expect(UNKNOWN_REPLY).toContain("/skills");
  });
});
