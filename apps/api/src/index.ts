import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import { loadConfig } from "./config/env.js";

const config = loadConfig({
  ...process.env,
  CONTENT_DIR:
    process.env.CONTENT_DIR ??
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../content"),
});

async function checkOllama() {
  try {
    const res = await fetch(`${config.ollamaUrl}/api/tags`);
    return res.ok;
  } catch {
    return false;
  }
}

const app = createApp({ checkOllama });
app.listen(config.port, () => {
  console.log(`API listening on :${config.port}`);
});
