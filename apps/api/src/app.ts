import express from "express";
import { healthRouter } from "./routes/health.js";

export type AppDeps = {
  checkOllama: () => Promise<boolean>;
};

export function createApp(deps: AppDeps) {
  const app = express();
  app.use(express.json({ limit: "32kb" }));
  app.use(healthRouter(deps.checkOllama));
  return app;
}
