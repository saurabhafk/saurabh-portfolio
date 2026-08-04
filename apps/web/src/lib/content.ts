import path from "node:path";
import { loadPortfolioContent } from "@portfolio/content-core";
import type { PortfolioContent } from "@portfolio/content-core";

const contentDir = path.join(process.cwd(), "../../content");

export function getContent(): PortfolioContent {
  return loadPortfolioContent(contentDir);
}
