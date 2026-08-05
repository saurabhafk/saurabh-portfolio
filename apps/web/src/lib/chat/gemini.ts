import type { ChatMessage } from "./types";

const GEMINI_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

export type GeminiClient = {
  embed: (text: string) => Promise<number[]>;
  chat: (messages: ChatMessage[]) => Promise<string>;
};

function requireKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return key;
}

export function createGeminiClient(opts?: {
  embedModel?: string;
  chatModel?: string;
}): GeminiClient {
  const embedModel = opts?.embedModel ?? process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";
  const chatModel =
    opts?.chatModel ?? process.env.GEMINI_CHAT_MODEL ?? "gemini-flash-lite-latest";

  return {
    async embed(text: string) {
      const key = requireKey();
      const prompt = text.length > 8000 ? text.slice(0, 8000) : text;
      const res = await fetch(
        `${GEMINI_BASE}/${embedModel}:embedContent?key=${encodeURIComponent(key)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: `models/${embedModel}`,
            content: { parts: [{ text: prompt }] },
          }),
        }
      );
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Gemini embed failed: ${res.status} ${body}`);
      }
      const data = (await res.json()) as {
        embedding?: { values?: number[] };
      };
      const values = data.embedding?.values;
      if (!values?.length) throw new Error("Gemini embed returned no values");
      return values;
    },

    async chat(messages: ChatMessage[]) {
      const key = requireKey();
      const system = messages
        .filter((m) => m.role === "system")
        .map((m) => m.content)
        .join("\n\n");
      const contents = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      const res = await fetch(
        `${GEMINI_BASE}/${chatModel}:generateContent?key=${encodeURIComponent(key)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: system
              ? { parts: [{ text: system }] }
              : undefined,
            contents,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
            },
          }),
        }
      );
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Gemini chat failed: ${res.status} ${body}`);
      }
      const data = (await res.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };
      const text = data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? "")
        .join("");
      if (!text) throw new Error("Gemini chat returned empty text");
      return text;
    },
  };
}
