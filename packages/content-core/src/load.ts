import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  About,
  Experience,
  PortfolioContent,
  Project,
  Skill,
  Writing,
} from "./types.js";

function readMd(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

export function loadPortfolioContent(contentDir: string): PortfolioContent {
  const aboutFile = readMd(path.join(contentDir, "about.md"));
  const about: About = {
    title: String(aboutFile.data.title ?? "About"),
    body: aboutFile.content.trim(),
  };

  const skillsJson = JSON.parse(
    fs.readFileSync(path.join(contentDir, "skills.json"), "utf8")
  ) as { skills: Skill[] };
  const skills = skillsJson.skills.map((s) => ({
    ...s,
    projectSlugs: s.projectSlugs ?? [],
    writingSlugs: s.writingSlugs ?? [],
  }));

  const projectsDir = path.join(contentDir, "projects");
  const projects: Project[] = fs
    .readdirSync(projectsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const parsed = readMd(path.join(projectsDir, f));
      const d = parsed.data;
      return {
        title: String(d.title),
        slug: String(d.slug),
        summary: String(d.summary ?? ""),
        stack: (d.stack as string[]) ?? [],
        role: String(d.role ?? ""),
        links: (d.links as Project["links"]) ?? {},
        featured: Boolean(d.featured),
        body: parsed.content.trim(),
      };
    });

  const experienceDir = path.join(contentDir, "experience");
  const experience: Experience[] = fs
    .readdirSync(experienceDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const parsed = readMd(path.join(experienceDir, f));
      const d = parsed.data;
      return {
        id: f.replace(/\.md$/, ""),
        company: String(d.company),
        title: String(d.title),
        start: String(d.start),
        end: String(d.end),
        summary: String(d.summary ?? ""),
        highlights: (d.highlights as string[]) ?? [],
        stack: (d.stack as string[]) ?? [],
        body: parsed.content.trim(),
      };
    });

  const writingDir = path.join(contentDir, "writing");
  const writing: Writing[] = fs
    .readdirSync(writingDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const parsed = readMd(path.join(writingDir, f));
      const d = parsed.data;
      return {
        title: String(d.title),
        slug: String(d.slug),
        summary: String(d.summary ?? ""),
        tags: (d.tags as string[]) ?? [],
        publishedAt: String(d.publishedAt ?? ""),
        body: parsed.content.trim(),
      };
    });

  return { about, skills, projects, experience, writing };
}
