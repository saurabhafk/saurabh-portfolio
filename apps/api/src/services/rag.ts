import type { ChatMessage } from "../lib/ollama.js";
import type { QueryHit } from "../lib/vector-store.js";

export const UNKNOWN_REPLY =
  "I don't have that documented in this portfolio yet — happy to walk through it directly. Email [saurabhsri98@gmail.com](mailto:saurabhsri98@gmail.com), ping me on [LinkedIn](https://linkedin.com/in/saurabhafk), or call +91 8574131772. You can also browse [Projects](/projects), [Skills](/skills), or [About](/about).";

export function filterHits(hits: QueryHit[], threshold: number): QueryHit[] {
  return hits.filter((h) => h.score >= threshold);
}

function formatContext(hits: QueryHit[]): string {
  return hits
    .map(
      (h, i) =>
        `[${i + 1}] title: ${h.chunk.title}\nurl: ${h.chunk.url}\ntext: ${h.chunk.text}`
    )
    .join("\n\n");
}

/** Parse the coverage-gate model reply. Default to insufficient when unclear. */
export function contextCoversQuestion(gateReply: string): boolean {
  const first = gateReply.trim().split(/\s+/)[0]?.replace(/[^A-Za-z]/g, "") ?? "";
  return /^yes$/i.test(first);
}

export function buildCoverageGateMessages(
  userMessage: string,
  hits: QueryHit[]
): ChatMessage[] {
  const context = formatContext(hits);
  const system = `You are a strict coverage checker for a portfolio chatbot.
Reply with a single word: YES or NO.

YES only if the context explicitly contains the facts needed to answer the user's question.
Related or adjacent topics are NOT enough.
- Context mentions Intercom for support chat → NO for questions about Intercom auth/security implementation.
- Context says "Used Redux Toolkit on Ponteo" → YES for "Have you worked with Redux Toolkit?"
- Context lists a skill name only → NO for how that skill was implemented.

Context:
${context}`;

  return [
    { role: "system", content: system },
    { role: "user", content: userMessage },
  ];
}

export function buildChatMessages(
  userMessage: string,
  hits: QueryHit[]
): ChatMessage[] {
  const context = formatContext(hits);

  const system = `You answer as Saurabh Srivastava on his personal portfolio site — in first person ("I", "my", "me").
Visitors are asking you directly about your work.
Answer ONLY using facts that the context explicitly supports for THIS question.
Related topics in context are not enough — e.g. mentioning Intercom on a project does not let you invent how Intercom auth worked.
If the context does not specifically answer the question, reply with EXACTLY this text and nothing else:
${UNKNOWN_REPLY}
When a skill chunk lists projects that used that skill, treat that as confirmation you used it on those projects — but only for "did you use X?" style questions, not for undocumented implementation details.
Include markdown links using the exact url values from context (e.g. [Ponteo](/projects/ponteo)).
Do not invent employers, projects, skills, APIs, security designs, or implementation details not present in the context.
Keep replies concise and conversational when you do answer from context.

Context:
${context}`;

  return [
    { role: "system", content: system },
    { role: "user", content: userMessage },
  ];
}
