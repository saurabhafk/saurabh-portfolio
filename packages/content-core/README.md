# @portfolio/content-core

Shared library: load `content/` into typed objects and build RAG text chunks.

## Layout

```
src/
  types.ts    # PortfolioContent, Project, Skill, …
  load.ts     # filesystem → PortfolioContent
  chunks.ts   # PortfolioContent → ContentChunk[]
  index.ts    # public exports
```

## Build

Consumers import the compiled package. After edits:

```bash
npm run build -w @portfolio/content-core
npm test -w @portfolio/content-core
```

See [docs/guide/HOW_IT_WORKS.md](../../docs/guide/HOW_IT_WORKS.md).
