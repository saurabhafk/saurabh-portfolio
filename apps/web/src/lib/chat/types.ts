import type { ContentChunk } from "@portfolio/content-core";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

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

export function queryIndex(
  items: IndexedChunk[],
  embedding: number[],
  topK: number
): QueryHit[] {
  return items
    .map((item) => ({
      chunk: item.chunk,
      score: cosineSimilarity(embedding, item.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
