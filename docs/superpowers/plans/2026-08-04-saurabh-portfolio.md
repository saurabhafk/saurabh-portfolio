# Saurabh Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js portfolio with a floating RAG chatbot (Node API + Ollama on a VPS) that answers questions about Saurabh’s work with deep-links into file-based content.

**Architecture:** Monorepo with shared `content/`, `apps/web` (Next.js on Vercel), and `apps/api` (Express on VPS). The API loads markdown/JSON into RAG chunks, embeds via Ollama, retrieves by cosine similarity, and prompts Ollama to answer only from retrieved chunks plus `sources[]` for widget chips.

**Tech Stack:** TypeScript, Next.js (App Router), Express, Vitest, gray-matter, Ollama (`nomic-embed-text` + `llama3.2`), npm workspaces

**Spec:** `docs/superpowers/specs/2026-08-04-saurabh-portfolio-design.md`

---

## File structure

| Path | Responsibility |
|------|----------------|
| `package.json` | npm workspaces root |
| `content/**` | Source of truth: about, skills, projects, experience, writing |
| `packages/content-core/` | Shared types, markdown loader, chunk builder (used by web + api) |
| `apps/api/src/index.ts` | Express app bootstrap |
| `apps/api/src/config.ts` | Env: PORT, CORS_ORIGINS, REINDEX_SECRET, OLLAMA_URL, models |
| `apps/api/src/ollama.ts` | Embed + chat HTTP client (injectable for tests) |
| `apps/api/src/vector-store.ts` | In-memory vectors + persist `data/index.json` |
| `apps/api/src/rag.ts` | Retrieve + build prompt + parse reply |
| `apps/api/src/routes/chat.ts` | `POST /api/chat` |
| `apps/api/src/routes/reindex.ts` | `POST /api/reindex` |
| `apps/api/src/routes/health.ts` | `GET /api/health` |
| `apps/api/src/middleware/rate-limit.ts` | Per-IP throttle for chat |
| `apps/api/src/middleware/cors.ts` | Origin allowlist |
| `apps/web/` | Next.js portfolio + ChatWidget |
| `apps/web/src/components/ChatWidget.tsx` | Floating chat UI |
| `apps/web/src/lib/api.ts` | Chat API client |
| `docs/deploy.md` | Vercel + VPS + Ollama deploy notes |

---

### Task 1: Monorepo scaffold

**Files:**
- Create: `package.json`
- Create: `.gitignore` (extend existing)
- Create: `packages/content-core/package.json`
- Create: `packages/content-core/tsconfig.json`
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/web/package.json` (via `create-next-app` in steps)

- [ ] **Step 1: Write root workspace package.json**

```json
{
  "name": "saurabh-portfolio",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "test": "npm run test -w @portfolio/content-core && npm run test -w @portfolio/api",
    "dev:api": "npm run dev -w @portfolio/api",
    "dev:web": "npm run dev -w @portfolio/web",
    "build": "npm run build -w @portfolio/content-core && npm run build -w @portfolio/api && npm run build -w @portfolio/web"
  }
}
```

- [ ] **Step 2: Extend `.gitignore`**

Append if missing:

```
node_modules/
dist/
.next/
data/
.env
.env.*
!.env.example
.DS_Store
.superpowers/
```

- [ ] **Step 3: Scaffold `packages/content-core`**

`packages/content-core/package.json`:

```json
{
  "name": "@portfolio/content-core",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "gray-matter": "^4.0.3"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "vitest": "^3.0.5"
  }
}
```

`packages/content-core/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Create placeholder `packages/content-core/src/index.ts`:

```ts
export {};
```

- [ ] **Step 4: Scaffold `apps/api` package.json + tsconfig**

`apps/api/package.json`:

```json
{
  "name": "@portfolio/api",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@portfolio/content-core": "*",
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "express-rate-limit": "^7.5.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^22.10.7",
    "@types/supertest": "^6.0.2",
    "supertest": "^7.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vitest": "^3.0.5"
  }
}
```

`apps/api/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create Next.js app in `apps/web`**

Run from repo root:

```bash
npx create-next-app@15 apps/web --typescript --eslint --app --src-dir --import-alias "@/*" --tailwind --use-npm --turbopack
```

Then set `"name": "@portfolio/web"` in `apps/web/package.json` and add dependency `"@portfolio/content-core": "*"`.

- [ ] **Step 6: Install workspaces**

```bash
npm install
```

Expected: lockfile created; workspaces link.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json .gitignore packages/content-core apps/api apps/web
git commit -m "chore: scaffold monorepo with web, api, and content-core"
```

---

### Task 2: Sample content fixtures

**Files:**
- Create: `content/about.md`
- Create: `content/skills.json`
- Create: `content/projects/fittrack.md`
- Create: `content/experience/acme-mobile.md`
- Create: `content/writing/redux-in-rn.md`
- Create: `packages/content-core/fixtures/` (symlink or copy path used in tests — tests will point at `content/` via absolute fixture dir under package)

- [ ] **Step 1: Write `content/about.md`**

```markdown
---
title: About Saurabh
---

Saurabh is a full-stack engineer focused on **React Native** app development, expanding into backend, APIs, and AI-assisted products. He builds mobile experiences end-to-end and is growing deeper into server-side systems.
```

- [ ] **Step 2: Write `content/skills.json`**

```json
{
  "skills": [
    {
      "id": "react-native",
      "name": "React Native",
      "projectSlugs": ["fittrack"],
      "writingSlugs": []
    },
    {
      "id": "redux-toolkit",
      "name": "Redux Toolkit",
      "projectSlugs": ["fittrack"],
      "writingSlugs": ["redux-in-rn"]
    },
    {
      "id": "nodejs",
      "name": "Node.js",
      "projectSlugs": ["fittrack"],
      "writingSlugs": []
    }
  ]
}
```

- [ ] **Step 3: Write `content/projects/fittrack.md`**

```markdown
---
title: FitTrack
slug: fittrack
summary: React Native fitness tracker with offline-first state and a small Node sync API.
stack:
  - react-native
  - redux-toolkit
  - nodejs
role: Full-stack mobile
links:
  repo: https://github.com/example/fittrack
  demo: null
featured: true
---

## Overview

FitTrack helps users log workouts offline and sync when online.

## Redux Toolkit

Client state (workouts, prefs, sync queue) is managed with **Redux Toolkit** slices and RTK Query for the sync API.
```

- [ ] **Step 4: Write experience + writing fixtures**

`content/experience/acme-mobile.md`:

```markdown
---
company: Acme Health
title: React Native Engineer
start: 2023-01
end: present
summary: Shipped patient-facing RN apps and shared design system components.
highlights:
  - Led offline sync for appointment booking
  - Introduced Redux Toolkit across two apps
stack:
  - react-native
  - redux-toolkit
---
```

`content/writing/redux-in-rn.md`:

```markdown
---
title: Redux Toolkit in React Native
slug: redux-in-rn
summary: Patterns for predictable mobile state with RTK.
tags:
  - redux-toolkit
  - react-native
publishedAt: 2025-06-01
---

Notes on structuring RTK slices for navigation-heavy RN apps, including FitTrack lessons.
```

- [ ] **Step 5: Commit**

```bash
git add content
git commit -m "content: add initial about, skills, project, experience, and writing fixtures"
```

---

### Task 3: Content-core types + loader (TDD)

**Files:**
- Create: `packages/content-core/src/types.ts`
- Create: `packages/content-core/src/load.ts`
- Create: `packages/content-core/src/index.ts`
- Create: `packages/content-core/vitest.config.ts`
- Test: `packages/content-core/src/load.test.ts`

- [ ] **Step 1: Write failing tests**

`packages/content-core/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
});
```

`packages/content-core/src/load.test.ts`:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadPortfolioContent } from "./load.js";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../.."
);
const contentDir = path.join(repoRoot, "content");

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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -w @portfolio/content-core
```

Expected: FAIL — `loadPortfolioContent` not exported / module missing.

- [ ] **Step 3: Implement types + loader**

`packages/content-core/src/types.ts`:

```ts
export type Skill = {
  id: string;
  name: string;
  projectSlugs: string[];
  writingSlugs: string[];
};

export type Project = {
  title: string;
  slug: string;
  summary: string;
  stack: string[];
  role: string;
  links: { repo?: string | null; demo?: string | null };
  featured: boolean;
  body: string;
};

export type Experience = {
  company: string;
  title: string;
  start: string;
  end: string;
  summary: string;
  highlights: string[];
  stack: string[];
  body: string;
  id: string;
};

export type Writing = {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  publishedAt: string;
  body: string;
};

export type About = {
  title: string;
  body: string;
};

export type PortfolioContent = {
  about: About;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  writing: Writing[];
};

export type ContentChunk = {
  id: string;
  title: string;
  url: string;
  sourceType: "about" | "skill" | "project" | "experience" | "writing";
  text: string;
};
```

`packages/content-core/src/load.ts`:

```ts
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
```

`packages/content-core/src/index.ts`:

```ts
export * from "./types.js";
export * from "./load.js";
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test -w @portfolio/content-core
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/content-core
git commit -m "feat(content-core): load portfolio markdown and skills.json"
```

---

### Task 4: Chunk builder with portfolio URLs (TDD)

**Files:**
- Create: `packages/content-core/src/chunks.ts`
- Modify: `packages/content-core/src/index.ts`
- Test: `packages/content-core/src/chunks.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildContentChunks } from "./chunks.js";
import { loadPortfolioContent } from "./load.js";

const contentDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../content"
);

describe("buildContentChunks", () => {
  it("emits urls for projects, skills, writing, experience, about", () => {
    const content = loadPortfolioContent(contentDir);
    const chunks = buildContentChunks(content);
    const urls = chunks.map((c) => c.url);
    expect(urls).toContain("/about");
    expect(urls).toContain("/projects/fittrack");
    expect(urls).toContain("/skills#redux-toolkit");
    expect(urls).toContain("/writing/redux-in-rn");
    expect(urls.some((u) => u.startsWith("/experience"))).toBe(true);
    const reduxProject = chunks.find(
      (c) => c.url === "/projects/fittrack" && c.text.toLowerCase().includes("redux")
    );
    expect(reduxProject).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test — expect fail**

```bash
npm run test -w @portfolio/content-core
```

Expected: FAIL — `buildContentChunks` missing.

- [ ] **Step 3: Implement `chunks.ts`**

```ts
import type { ContentChunk, PortfolioContent } from "./types.js";

export function buildContentChunks(content: PortfolioContent): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  chunks.push({
    id: "about",
    title: content.about.title,
    url: "/about",
    sourceType: "about",
    text: `${content.about.title}\n${content.about.body}`,
  });

  for (const skill of content.skills) {
    const relatedProjects = skill.projectSlugs.join(", ");
    chunks.push({
      id: `skill:${skill.id}`,
      title: skill.name,
      url: `/skills#${skill.id}`,
      sourceType: "skill",
      text: `Skill: ${skill.name} (${skill.id}). Related projects: ${relatedProjects}. Related writing: ${skill.writingSlugs.join(", ")}`,
    });
  }

  for (const project of content.projects) {
    chunks.push({
      id: `project:${project.slug}`,
      title: project.title,
      url: `/projects/${project.slug}`,
      sourceType: "project",
      text: `${project.title}. ${project.summary}. Role: ${project.role}. Stack: ${project.stack.join(", ")}.\n${project.body}`,
    });
  }

  for (const exp of content.experience) {
    chunks.push({
      id: `experience:${exp.id}`,
      title: `${exp.title} @ ${exp.company}`,
      url: `/experience#${exp.id}`,
      sourceType: "experience",
      text: `${exp.title} at ${exp.company} (${exp.start}–${exp.end}). ${exp.summary}. Highlights: ${exp.highlights.join("; ")}. Stack: ${exp.stack.join(", ")}.\n${exp.body}`,
    });
  }

  for (const post of content.writing) {
    chunks.push({
      id: `writing:${post.slug}`,
      title: post.title,
      url: `/writing/${post.slug}`,
      sourceType: "writing",
      text: `${post.title}. ${post.summary}. Tags: ${post.tags.join(", ")}.\n${post.body}`,
    });
  }

  return chunks;
}
```

Export from `index.ts`:

```ts
export * from "./types.js";
export * from "./load.js";
export * from "./chunks.js";
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test -w @portfolio/content-core
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/content-core
git commit -m "feat(content-core): build RAG chunks with portfolio deep-link urls"
```

---

### Task 5: API config, health, and Express bootstrap

**Files:**
- Create: `apps/api/src/config.ts`
- Create: `apps/api/src/create-app.ts`
- Create: `apps/api/src/routes/health.ts`
- Create: `apps/api/src/index.ts`
- Create: `apps/api/.env.example`
- Create: `apps/api/vitest.config.ts`
- Test: `apps/api/src/routes/health.test.ts`

- [ ] **Step 1: Write failing health test**

`apps/api/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node" },
});
```

`apps/api/src/routes/health.test.ts`:

```ts
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../create-app.js";

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
```

- [ ] **Step 2: Run test — expect fail**

```bash
npm run test -w @portfolio/api
```

Expected: FAIL — modules missing.

- [ ] **Step 3: Implement config, health, createApp, index**

`apps/api/src/config.ts`:

```ts
export type AppConfig = {
  port: number;
  contentDir: string;
  corsOrigins: string[];
  reindexSecret: string;
  ollamaUrl: string;
  embedModel: string;
  chatModel: string;
  indexPath: string;
  relevanceThreshold: number;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    port: Number(env.PORT ?? 4000),
    contentDir: env.CONTENT_DIR ?? "",
    corsOrigins: (env.CORS_ORIGINS ?? "http://localhost:3000")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    reindexSecret: env.REINDEX_SECRET ?? "dev-reindex-secret",
    ollamaUrl: env.OLLAMA_URL ?? "http://127.0.0.1:11434",
    embedModel: env.EMBED_MODEL ?? "nomic-embed-text",
    chatModel: env.CHAT_MODEL ?? "llama3.2",
    indexPath: env.INDEX_PATH ?? "data/index.json",
    relevanceThreshold: Number(env.RELEVANCE_THRESHOLD ?? 0.35),
  };
}
```

`apps/api/src/routes/health.ts`:

```ts
import { Router } from "express";

export function healthRouter(checkOllama: () => Promise<boolean>) {
  const router = Router();
  router.get("/api/health", async (_req, res) => {
    const ollama = await checkOllama();
    res.json({ ok: true, ollama });
  });
  return router;
}
```

`apps/api/src/create-app.ts`:

```ts
import express from "express";
import { healthRouter } from "./routes/health.js";

export type AppDeps = {
  checkOllama: () => Promise<boolean>;
};

export function createApp(deps: AppDeps) {
  const app = express();
  app.use(express.json({ limit: "32kb" }));
  app.use(healthRouter(deps.checkOllama));
  return app;
}
```

`apps/api/src/index.ts`:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.js";
import { createApp } from "./create-app.js";

const config = loadConfig({
  ...process.env,
  CONTENT_DIR:
    process.env.CONTENT_DIR ??
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../content"),
});

async function checkOllama() {
  try {
    const res = await fetch(`${config.ollamaUrl}/api/tags`);
    return res.ok;
  } catch {
    return false;
  }
}

const app = createApp({ checkOllama });
app.listen(config.port, () => {
  console.log(`API listening on :${config.port}`);
});
```

`apps/api/.env.example`:

```
PORT=4000
CONTENT_DIR=../../content
CORS_ORIGINS=http://localhost:3000
REINDEX_SECRET=change-me
OLLAMA_URL=http://127.0.0.1:11434
EMBED_MODEL=nomic-embed-text
CHAT_MODEL=llama3.2
INDEX_PATH=data/index.json
RELEVANCE_THRESHOLD=0.35
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test -w @portfolio/api
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/api
git commit -m "feat(api): bootstrap Express app with health endpoint"
```

---

### Task 6: Ollama client (mockable)

**Files:**
- Create: `apps/api/src/ollama.ts`
- Test: `apps/api/src/ollama.test.ts`

- [ ] **Step 1: Write failing tests with mocked fetch**

```ts
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
```

- [ ] **Step 2: Run — expect fail**

```bash
npm run test -w @portfolio/api
```

Expected: FAIL — `createOllamaClient` missing.

- [ ] **Step 3: Implement**

```ts
export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type OllamaClient = {
  embed: (text: string) => Promise<number[]>;
  chat: (messages: ChatMessage[]) => Promise<string>;
  isReachable: () => Promise<boolean>;
};

export function createOllamaClient(opts: {
  baseUrl: string;
  embedModel: string;
  chatModel: string;
}): OllamaClient {
  const { baseUrl, embedModel, chatModel } = opts;

  return {
    async isReachable() {
      try {
        const res = await fetch(`${baseUrl}/api/tags`);
        return res.ok;
      } catch {
        return false;
      }
    },

    async embed(text: string) {
      const res = await fetch(`${baseUrl}/api/embeddings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: embedModel, prompt: text }),
      });
      if (!res.ok) throw new Error(`Ollama embed failed: ${res.status}`);
      const data = (await res.json()) as { embedding: number[] };
      return data.embedding;
    },

    async chat(messages: ChatMessage[]) {
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: chatModel,
          stream: false,
          messages,
        }),
      });
      if (!res.ok) throw new Error(`Ollama chat failed: ${res.status}`);
      const data = (await res.json()) as {
        message: { content: string };
      };
      return data.message.content;
    },
  };
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test -w @portfolio/api
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/ollama.ts apps/api/src/ollama.test.ts
git commit -m "feat(api): add mockable Ollama embed and chat client"
```

---

### Task 7: Vector store + reindex (TDD)

**Files:**
- Create: `apps/api/src/vector-store.ts`
- Create: `apps/api/src/reindex.ts`
- Test: `apps/api/src/vector-store.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
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
```

- [ ] **Step 2: Run — expect fail**

```bash
npm run test -w @portfolio/api
```

Expected: FAIL

- [ ] **Step 3: Implement vector store**

```ts
import fs from "node:fs";
import path from "node:path";
import type { ContentChunk } from "@portfolio/content-core";

export type IndexedChunk = {
  chunk: ContentChunk;
  embedding: number[];
};

export type QueryHit = {
  chunk: ContentChunk;
  score: number;
};

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export class VectorStore {
  private items: IndexedChunk[] = [];

  constructor(private readonly indexPath: string) {
    this.load();
  }

  private load() {
    if (!fs.existsSync(this.indexPath)) return;
    const raw = JSON.parse(fs.readFileSync(this.indexPath, "utf8")) as {
      items: IndexedChunk[];
    };
    this.items = raw.items ?? [];
  }

  private persist() {
    fs.mkdirSync(path.dirname(this.indexPath), { recursive: true });
    fs.writeFileSync(
      this.indexPath,
      JSON.stringify({ items: this.items }, null, 2)
    );
  }

  async rebuild(
    chunks: ContentChunk[],
    embed: (text: string) => Promise<number[]>
  ) {
    const items: IndexedChunk[] = [];
    for (const chunk of chunks) {
      const embedding = await embed(chunk.text);
      items.push({ chunk, embedding });
    }
    this.items = items;
    this.persist();
  }

  query(embedding: number[], topK: number): QueryHit[] {
    return this.items
      .map((item) => ({
        chunk: item.chunk,
        score: cosineSimilarity(embedding, item.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  get size() {
    return this.items.length;
  }
}
```

`apps/api/src/reindex.ts`:

```ts
import {
  buildContentChunks,
  loadPortfolioContent,
} from "@portfolio/content-core";
import type { OllamaClient } from "./ollama.js";
import type { VectorStore } from "./vector-store.js";

export async function reindexFromContentDir(
  contentDir: string,
  store: VectorStore,
  ollama: OllamaClient
) {
  const content = loadPortfolioContent(contentDir);
  const chunks = buildContentChunks(content);
  await store.rebuild(chunks, (text) => ollama.embed(text));
  return { chunkCount: chunks.length };
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test -w @portfolio/api
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/vector-store.ts apps/api/src/vector-store.test.ts apps/api/src/reindex.ts
git commit -m "feat(api): add cosine vector store and content reindex helper"
```

---

### Task 8: RAG prompt + chat route (TDD)

**Files:**
- Create: `apps/api/src/rag.ts`
- Create: `apps/api/src/routes/chat.ts`
- Modify: `apps/api/src/create-app.ts`
- Test: `apps/api/src/rag.test.ts`
- Test: `apps/api/src/routes/chat.test.ts`

- [ ] **Step 1: Write failing RAG + chat tests**

`apps/api/src/rag.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildChatMessages, filterHits, UNKNOWN_REPLY } from "./rag.js";
import type { QueryHit } from "./vector-store.js";

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
    const kept = filterHits([hit("/projects/fittrack", 0.9), hit("/about", 0.1)], 0.35);
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
```

`apps/api/src/routes/chat.test.ts`:

```ts
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../create-app.js";
import type { OllamaClient } from "../ollama.js";
import { VectorStore } from "../vector-store.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function mockOllama(overrides: Partial<OllamaClient> = {}): OllamaClient {
  return {
    isReachable: async () => true,
    embed: async () => [1, 0],
    chat: async () =>
      "Yes. Saurabh used Redux Toolkit in [FitTrack](/projects/fittrack).",
    ...overrides,
  };
}

describe("POST /api/chat", () => {
  it("returns reply and sources for relevant query", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "chat-"));
    const store = new VectorStore(path.join(dir, "index.json"));
    await store.rebuild(
      [
        {
          id: "p",
          title: "FitTrack",
          url: "/projects/fittrack",
          sourceType: "project",
          text: "Redux Toolkit",
        },
      ],
      async () => [1, 0]
    );

    const app = createApp({
      checkOllama: async () => true,
      ollama: mockOllama(),
      store,
      relevanceThreshold: 0.35,
      corsOrigins: ["http://localhost:3000"],
      reindexSecret: "secret",
      contentDir: dir,
    });

    const res = await request(app)
      .post("/api/chat")
      .send({ message: "Has Saurabh worked with redux toolkit?" });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain("FitTrack");
    expect(res.body.sources[0].url).toBe("/projects/fittrack");
  });

  it("returns unknown fallback when nothing is relevant", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "chat-"));
    const store = new VectorStore(path.join(dir, "index.json"));
    await store.rebuild(
      [
        {
          id: "p",
          title: "FitTrack",
          url: "/projects/fittrack",
          sourceType: "project",
          text: "Redux Toolkit",
        },
      ],
      async () => [0, 1]
    );

    const app = createApp({
      checkOllama: async () => true,
      ollama: mockOllama({
        embed: async () => [1, 0],
        chat: async () => "should not be called",
      }),
      store,
      relevanceThreshold: 0.95,
      corsOrigins: ["http://localhost:3000"],
      reindexSecret: "secret",
      contentDir: dir,
    });

    const res = await request(app)
      .post("/api/chat")
      .send({ message: "totally unrelated topic xyz" });

    expect(res.status).toBe(200);
    expect(res.body.reply).toContain("/projects");
    expect(res.body.sources).toEqual([]);
  });

  it("returns 503 when ollama chat throws", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "chat-"));
    const store = new VectorStore(path.join(dir, "index.json"));
    await store.rebuild(
      [
        {
          id: "p",
          title: "FitTrack",
          url: "/projects/fittrack",
          sourceType: "project",
          text: "Redux Toolkit",
        },
      ],
      async () => [1, 0]
    );

    const app = createApp({
      checkOllama: async () => true,
      ollama: mockOllama({
        chat: async () => {
          throw new Error("down");
        },
      }),
      store,
      relevanceThreshold: 0.35,
      corsOrigins: ["http://localhost:3000"],
      reindexSecret: "secret",
      contentDir: dir,
    });

    const res = await request(app).post("/api/chat").send({ message: "redux" });
    expect(res.status).toBe(503);
  });
});
```

- [ ] **Step 2: Run — expect fail**

```bash
npm run test -w @portfolio/api
```

Expected: FAIL

- [ ] **Step 3: Implement rag + chat route; wire createApp**

`apps/api/src/rag.ts`:

```ts
import type { ChatMessage } from "./ollama.js";
import type { QueryHit } from "./vector-store.js";

export const UNKNOWN_REPLY =
  "I don’t have that in Saurabh’s portfolio content. Browse [Projects](/projects) or [Skills](/skills) to explore what’s documented.";

export function filterHits(hits: QueryHit[], threshold: number): QueryHit[] {
  return hits.filter((h) => h.score >= threshold);
}

export function buildChatMessages(
  userMessage: string,
  hits: QueryHit[]
): ChatMessage[] {
  const context = hits
    .map(
      (h, i) =>
        `[${i + 1}] title: ${h.chunk.title}\nurl: ${h.chunk.url}\ntext: ${h.chunk.text}`
    )
    .join("\n\n");

  const system = `You are the assistant for Saurabh's portfolio website.
Answer ONLY using the context below. If the context is insufficient, say you don't know.
Include markdown links using the exact url values from context (e.g. [FitTrack](/projects/fittrack)).
Do not invent employers, projects, or skills not present in the context.

Context:
${context}`;

  return [
    { role: "system", content: system },
    { role: "user", content: userMessage },
  ];
}
```

`apps/api/src/routes/chat.ts`:

```ts
import { Router } from "express";
import { z } from "zod";
import {
  UNKNOWN_REPLY,
  buildChatMessages,
  filterHits,
} from "../rag.js";
import type { OllamaClient } from "../ollama.js";
import type { VectorStore } from "../vector-store.js";

const bodySchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
});

export function chatRouter(opts: {
  ollama: OllamaClient;
  store: VectorStore;
  relevanceThreshold: number;
}) {
  const router = Router();

  router.post("/api/chat", async (req, res) => {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid body" });
      return;
    }

    try {
      const embedding = await opts.ollama.embed(parsed.data.message);
      const hits = filterHits(
        opts.store.query(embedding, 5),
        opts.relevanceThreshold
      );

      if (hits.length === 0) {
        res.json({ reply: UNKNOWN_REPLY, sources: [] });
        return;
      }

      const messages = buildChatMessages(parsed.data.message, hits);
      const reply = await opts.ollama.chat(messages);
      res.json({
        reply,
        sources: hits.map((h) => ({
          title: h.chunk.title,
          url: h.chunk.url,
        })),
      });
    } catch {
      res.status(503).json({ error: "Chat temporarily unavailable" });
    }
  });

  return router;
}
```

Replace `create-app.ts` with this version (rate limit + reindex wired in Task 9):

```ts
import cors from "cors";
import express from "express";
import type { OllamaClient } from "./ollama.js";
import type { VectorStore } from "./vector-store.js";
import { chatRouter } from "./routes/chat.js";
import { healthRouter } from "./routes/health.js";

export type AppDeps = {
  checkOllama: () => Promise<boolean>;
  ollama?: OllamaClient;
  store?: VectorStore;
  relevanceThreshold?: number;
  corsOrigins?: string[];
  reindexSecret?: string;
  contentDir?: string;
};

export function createApp(deps: AppDeps) {
  const app = express();
  app.use(express.json({ limit: "32kb" }));
  app.use(
    cors({
      origin: deps.corsOrigins ?? ["http://localhost:3000"],
    })
  );
  app.use(healthRouter(deps.checkOllama));

  if (deps.ollama && deps.store) {
    app.use(
      chatRouter({
        ollama: deps.ollama,
        store: deps.store,
        relevanceThreshold: deps.relevanceThreshold ?? 0.35,
      })
    );
  }

  return app;
}
```

Health tests keep passing with only `{ checkOllama }` because chat deps stay optional.

- [ ] **Step 4: Run tests — expect pass**

```bash
npm run test -w @portfolio/api
```

Expected: PASS (all api + prior health tests)

- [ ] **Step 5: Commit**

```bash
git add apps/api/src
git commit -m "feat(api): RAG chat endpoint with sources and honest fallback"
```

---

### Task 9: Reindex route, rate limit, wire `index.ts`

**Files:**
- Create: `apps/api/src/routes/reindex.ts`
- Modify: `apps/api/src/create-app.ts`
- Modify: `apps/api/src/index.ts`
- Test: `apps/api/src/routes/reindex.test.ts`

- [ ] **Step 1: Write failing reindex tests**

```ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../create-app.js";
import { VectorStore } from "../vector-store.js";

describe("POST /api/reindex", () => {
  it("rejects missing secret", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "re-"));
    // minimal content dir
    fs.writeFileSync(
      path.join(dir, "about.md"),
      "---\ntitle: About\n---\nHi\n"
    );
    fs.writeFileSync(
      path.join(dir, "skills.json"),
      JSON.stringify({ skills: [] })
    );
    for (const sub of ["projects", "experience", "writing"]) {
      fs.mkdirSync(path.join(dir, sub));
    }

    const store = new VectorStore(path.join(dir, "index.json"));
    const app = createApp({
      checkOllama: async () => true,
      ollama: {
        isReachable: async () => true,
        embed: async () => [1, 0],
        chat: async () => "",
      },
      store,
      contentDir: dir,
      reindexSecret: "secret",
      corsOrigins: ["http://localhost:3000"],
    });

    const res = await request(app).post("/api/reindex");
    expect(res.status).toBe(401);
  });

  it("rebuilds index with valid secret", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "re-"));
    fs.writeFileSync(
      path.join(dir, "about.md"),
      "---\ntitle: About\n---\nHi\n"
    );
    fs.writeFileSync(
      path.join(dir, "skills.json"),
      JSON.stringify({ skills: [] })
    );
    for (const sub of ["projects", "experience", "writing"]) {
      fs.mkdirSync(path.join(dir, sub));
    }

    const store = new VectorStore(path.join(dir, "index.json"));
    const app = createApp({
      checkOllama: async () => true,
      ollama: {
        isReachable: async () => true,
        embed: async () => [1, 0],
        chat: async () => "",
      },
      store,
      contentDir: dir,
      reindexSecret: "secret",
      corsOrigins: ["http://localhost:3000"],
    });

    const res = await request(app)
      .post("/api/reindex")
      .set("x-reindex-secret", "secret");
    expect(res.status).toBe(200);
    expect(res.body.chunkCount).toBeGreaterThanOrEqual(1);
  });
});
```

- [ ] **Step 2: Run — expect fail**

```bash
npm run test -w @portfolio/api
```

Expected: FAIL — reindex router missing.

- [ ] **Step 3: Implement reindex + rate limit + wire index**

`apps/api/src/routes/reindex.ts`:

```ts
import { Router } from "express";
import { reindexFromContentDir } from "../reindex.js";
import type { OllamaClient } from "../ollama.js";
import type { VectorStore } from "../vector-store.js";

export function reindexRouter(opts: {
  contentDir: string;
  store: VectorStore;
  ollama: OllamaClient;
  secret: string;
}) {
  const router = Router();
  router.post("/api/reindex", async (req, res) => {
    if (req.header("x-reindex-secret") !== opts.secret) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const result = await reindexFromContentDir(
        opts.contentDir,
        opts.store,
        opts.ollama
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Reindex failed" });
    }
  });
  return router;
}
```

Add rate limiting **inside** `chat.ts` so it always applies to the handler:

```ts
import rateLimit from "express-rate-limit";

const chatLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/api/chat", chatLimiter, async (req, res) => {
  // existing handler body
});
```

In `create-app.ts`, also mount reindex when deps are present:

```ts
import { reindexRouter } from "./routes/reindex.js";

// after chatRouter mount:
if (deps.ollama && deps.store && deps.contentDir && deps.reindexSecret) {
  app.use(
    reindexRouter({
      contentDir: deps.contentDir,
      store: deps.store,
      ollama: deps.ollama,
      secret: deps.reindexSecret,
    })
  );
}
```

Wire `index.ts` to create ollama, store, reindex on boot:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./config.js";
import { createApp } from "./create-app.js";
import { createOllamaClient } from "./ollama.js";
import { reindexFromContentDir } from "./reindex.js";
import { VectorStore } from "./vector-store.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const config = loadConfig({
  ...process.env,
  CONTENT_DIR: process.env.CONTENT_DIR ?? path.join(root, "content"),
  INDEX_PATH:
    process.env.INDEX_PATH ??
    path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/index.json"),
});

const ollama = createOllamaClient({
  baseUrl: config.ollamaUrl,
  embedModel: config.embedModel,
  chatModel: config.chatModel,
});
const store = new VectorStore(config.indexPath);

const app = createApp({
  checkOllama: () => ollama.isReachable(),
  ollama,
  store,
  relevanceThreshold: config.relevanceThreshold,
  corsOrigins: config.corsOrigins,
  reindexSecret: config.reindexSecret,
  contentDir: config.contentDir,
});

app.listen(config.port, async () => {
  console.log(`API listening on :${config.port}`);
  try {
    if (await ollama.isReachable()) {
      const result = await reindexFromContentDir(
        config.contentDir,
        store,
        ollama
      );
      console.log(`Indexed ${result.chunkCount} chunks`);
    } else {
      console.warn("Ollama not reachable; skipping startup reindex");
    }
  } catch (err) {
    console.warn("Startup reindex failed", err);
  }
});
```

- [ ] **Step 4: Run all api tests — expect pass**

```bash
npm run test -w @portfolio/api
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/api
git commit -m "feat(api): reindex route, rate limit, and startup indexing"
```

---

### Task 10: Next.js content pages

**Files:**
- Create: `apps/web/src/lib/content.ts`
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/about/page.tsx`
- Create: `apps/web/src/app/projects/page.tsx`
- Create: `apps/web/src/app/projects/[slug]/page.tsx`
- Create: `apps/web/src/app/experience/page.tsx`
- Create: `apps/web/src/app/skills/page.tsx`
- Create: `apps/web/src/app/writing/page.tsx`
- Create: `apps/web/src/app/writing/[slug]/page.tsx`
- Create: `apps/web/src/components/SiteHeader.tsx`
- Create: `apps/web/src/components/MarkdownBody.tsx`
- Modify: `apps/web/src/app/layout.tsx`
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/next.config.ts` (transpile `@portfolio/content-core`)

- [ ] **Step 1: Wire content helper + next config**

`apps/web/src/lib/content.ts`:

```ts
import path from "node:path";
import { loadPortfolioContent } from "@portfolio/content-core";

const contentDir = path.join(process.cwd(), "../../content");

export function getContent() {
  return loadPortfolioContent(contentDir);
}
```

In `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@portfolio/content-core"],
  serverExternalPackages: ["gray-matter"],
};

export default nextConfig;
```

Ensure `apps/web` can resolve content: when running from `apps/web`, `process.cwd()` is `apps/web`, so `../../content` is correct for monorepo root `content/`.

- [ ] **Step 2: Install markdown renderer + fonts**

```bash
npm install react-markdown -w @portfolio/web
```

In `layout.tsx`, load **Syne** + **DM Sans** via `next/font/google`. Set CSS variables in `globals.css`:

```css
:root {
  --bg: #0b0f0c;
  --bg-elevated: #121a14;
  --text: #e8f0e9;
  --muted: #9aab9e;
  --accent: #b6f34d;
  --line: #243028;
  --font-display: var(--font-syne);
  --font-body: var(--font-dm-sans);
}
body {
  margin: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% -10%, #1a3320 0%, transparent 55%),
    var(--bg);
  color: var(--text);
  font-family: var(--font-body), system-ui, sans-serif;
}
```

- [ ] **Step 3: Header + home + remaining routes**

`SiteHeader.tsx` — brand link “Saurabh” + nav: Projects, Experience, Skills, Writing, About.

`app/page.tsx` — full-bleed hero only: brand, one headline (“React Native apps, with a backend/AI path”), one sentence, CTAs linking to `/projects` and a button that dispatches `window` event `portfolio:open-chat` (ChatWidget listens in Task 11). No cards, stats, or secondary sections in the first viewport.

Implement remaining pages reading `getContent()`:

- `projects/page.tsx` — map projects to links `/projects/[slug]`
- `projects/[slug]/page.tsx` — `generateStaticParams` from projects; render title, summary, stack, `MarkdownBody`
- `experience/page.tsx` — each role wrapped with `id={exp.id}`
- `skills/page.tsx` — each skill `id={skill.id}`; link related `projectSlugs`
- `writing/page.tsx` + `writing/[slug]/page.tsx` — same pattern as projects
- `about/page.tsx` — about markdown body

`MarkdownBody.tsx`:

```tsx
import ReactMarkdown from "react-markdown";

export function MarkdownBody({ content }: { content: string }) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}
```

- [ ] **Step 4: Manual smoke**

```bash
npm run build -w @portfolio/content-core
npm run dev -w @portfolio/web
```

Open `http://localhost:3000/projects/fittrack` — expect FitTrack content.

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "feat(web): portfolio routes powered by shared content files"
```

---

### Task 11: ChatWidget + API client

**Files:**
- Create: `apps/web/src/lib/api.ts`
- Create: `apps/web/src/components/ChatWidget.tsx`
- Create: `apps/web/src/components/ChatMarkdown.tsx`
- Modify: `apps/web/src/app/layout.tsx` (mount widget)
- Create: `apps/web/.env.example`
- Create: `apps/web/.env.local` (local only, not committed)

- [ ] **Step 1: API client**

```ts
export type ChatSource = { title: string; url: string };
export type ChatResponse = { reply: string; sources: ChatSource[] };

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (res.status === 503) {
    throw new Error("Chat temporarily unavailable");
  }
  if (!res.ok) {
    throw new Error("Chat request failed");
  }
  return res.json();
}
```

- [ ] **Step 2: ChatMarkdown — internal links use Next.js**

Render markdown; for `href` starting with `/`, use `next/link`. Show `sources` as chips below the assistant message (title → Link).

- [ ] **Step 3: ChatWidget UI**

- Fixed launcher button bottom-right
- Panel: message list, input, send
- States: idle, loading, error (`Chat temporarily unavailable`)
- On submit call `sendChatMessage`
- Suggested starter: “Has Saurabh worked with Redux Toolkit?”

- [ ] **Step 4: Mount in root layout + env example**

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

- [ ] **Step 5: Manual E2E with Ollama (if available)**

```bash
# terminal A
ollama pull nomic-embed-text
ollama pull llama3.2
npm run dev -w @portfolio/api

# terminal B
npm run dev -w @portfolio/web
```

Ask the starter question; click FitTrack link — expect navigation to `/projects/fittrack`.

If Ollama unavailable: verify widget shows unavailable on 503; pages still load.

- [ ] **Step 6: Commit**

```bash
git add apps/web
git commit -m "feat(web): floating chat widget with deep-link sources"
```

---

### Task 12: Deploy docs + README

**Files:**
- Create: `docs/deploy.md`
- Create: `README.md`

- [ ] **Step 1: Write `docs/deploy.md`**

Cover:

1. **VPS:** install Node 22, Ollama; `ollama pull nomic-embed-text && ollama pull llama3.2`; clone repo; `npm install && npm run build -w @portfolio/content-core && npm run build -w @portfolio/api`; set env (`CONTENT_DIR` to repo `content/`, `CORS_ORIGINS` to Vercel URL, `REINDEX_SECRET`); run with systemd or PM2; bind API to public port / reverse proxy; keep Ollama on `127.0.0.1:11434`.
2. **Vercel:** root or `apps/web` as project; set `NEXT_PUBLIC_API_URL` to `https://api.yourdomain.com`; build command builds content-core then web.
3. **After content updates:** redeploy web; SSH/CI hit `POST /api/reindex` with `x-reindex-secret`.

- [ ] **Step 2: Write root `README.md`**

Quickstart: install Ollama models, `npm install`, build content-core, `dev:api` + `dev:web`, pointer to spec + plan + deploy doc.

- [ ] **Step 3: Commit**

```bash
git add docs/deploy.md README.md
git commit -m "docs: add README and Vercel/VPS deploy guide"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Next.js + Node separate apps | 1, 10, 5 |
| Shared `content/` monorepo sync | 1, 2, 3 |
| Routes: home, projects, experience, skills, writing, about | 10 |
| Floating chat widget | 11 |
| RAG + Ollama embeddings/chat | 6, 7, 8 |
| Deep-link urls + sources chips | 4, 8, 11 |
| Honest unknown fallback | 8 |
| 503 when Ollama down | 8, 11 |
| Rate limit + CORS + reindex secret | 9 |
| Health endpoint | 5 |
| Startup reindex | 9 |
| Deploy Vercel + VPS docs | 12 |
| Visual design rules | 10 (implementation constraints) |
| Admin/CMS /ask / paid LLM | Explicitly out of scope |

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-04-saurabh-portfolio.md`. Two execution options:

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration  

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints  

Which approach?
