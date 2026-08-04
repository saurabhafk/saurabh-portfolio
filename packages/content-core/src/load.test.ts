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
    expect(data.about.title).toBe("About Saurabh");
    expect(data.about.body).toContain("React Native");
    expect(data.skills.some((s) => s.id === "redux-toolkit")).toBe(true);
    expect(data.projects.find((p) => p.slug === "fittrack")?.stack).toContain(
      "redux-toolkit"
    );
    expect(data.experience[0]?.company).toBe("Acme Health");
    expect(data.writing.find((w) => w.slug === "redux-in-rn")).toBeTruthy();
  });
});
