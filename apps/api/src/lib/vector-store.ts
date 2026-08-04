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
