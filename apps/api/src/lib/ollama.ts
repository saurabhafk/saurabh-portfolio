export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

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
