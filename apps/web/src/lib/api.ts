export type ChatSource = { title: string; url: string };

export type ChatResponse = {
  reply: string;
  sources: ChatSource[];
};

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

  return res.json() as Promise<ChatResponse>;
}
