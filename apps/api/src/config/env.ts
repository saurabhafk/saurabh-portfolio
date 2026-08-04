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
