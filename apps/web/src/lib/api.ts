export type ChatSource = { title: string; url: string };

export type ChatResponse = {
  reply: string;
  sources: ChatSource[];
};

/**
 * Same-origin `/api/chat` on Vercel (Gemini).
 * Optional NEXT_PUBLIC_API_URL overrides for local Express+Ollama.
 */
export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  const url = base ? `${base}/api/chat` : "/api/chat";
  const res = await fetch(url, {
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

  return res.json() as Promise<ChatResponse>;
}
