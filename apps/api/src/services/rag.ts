import type { ChatMessage } from "../lib/ollama.js";
import type { QueryHit } from "../lib/vector-store.js";

export const UNKNOWN_REPLY =
  "I don't have that in Saurabh's portfolio content. Browse [Projects](/projects) or [Skills](/skills) to explore what's documented.";

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
