import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadPortfolioContent } from "./load.js";

const contentDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../content"
);

describe("loadPortfolioContent", () => {
  it("loads about, skills, projects, experience, and writing", () => {
    const data = loadPortfolioContent(contentDir);
    expect(data.about.title).toBe("About me");
    expect(data.about.body).toContain("React Native");
    expect(data.about.body).toMatch(/\bI['’]m\b|\bI\b/);
    expect(data.skills.some((s) => s.id === "redux-toolkit")).toBe(true);
    expect(data.projects.find((p) => p.slug === "ponteo")).toBeTruthy();
    expect(
      data.projects.find((p) => p.slug === "loginext-dispatcher")?.stack
    ).toContain("redux-toolkit");
    expect(data.experience[0]?.company).toBe("Appinventiv Technologies");
    expect(data.writing.find((w) => w.slug === "rn-state-with-rtk")).toBeTruthy();
    expect(data.certifications).toHaveLength(8);
    expect(
      data.certifications.find(
        (c) => c.id === "anthropic-introduction-to-subagents"
      )
    ).toBeTruthy();
    expect(
      data.certifications.every((c) =>
        c.credentialUrl?.includes("verify.skilljar.com")
      )
    ).toBe(true);
    expect(
      data.certifications.find((c) => c.id === "anthropic-claude-code-101")
        ?.name
    ).toBe("Claude Code 101");
  });
});
