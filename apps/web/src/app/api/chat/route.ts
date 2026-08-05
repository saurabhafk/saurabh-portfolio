import { NextResponse } from "next/server";
import {
  UNKNOWN_REPLY,
  buildChatMessages,
  buildCoverageGateMessages,
  contextCoversQuestion,
  filterHits,
} from "@/lib/chat/rag";
import { createGeminiClient } from "@/lib/chat/gemini";
import { loadOrBuildIndex } from "@/lib/chat/index-store";
import { queryIndex } from "@/lib/chat/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const RELEVANCE_THRESHOLD = Number(process.env.RELEVANCE_THRESHOLD ?? 0.35);

export async function POST(req: Request) {
  let message: string;
  try {
    const body = (await req.json()) as { message?: unknown };
    if (typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    if (body.message.length > 2000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }
    message = body.message.trim();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Chat temporarily unavailable" },
      { status: 503 }
    );
  }

  try {
    const gemini = createGeminiClient();
    const items = await loadOrBuildIndex();
    const embedding = await gemini.embed(message);
    const hits = filterHits(
      queryIndex(items, embedding, 5),
      RELEVANCE_THRESHOLD
    );

    if (hits.length === 0) {
      return NextResponse.json({ reply: UNKNOWN_REPLY, sources: [] });
    }

    const gate = await gemini.chat(buildCoverageGateMessages(message, hits));
    if (!contextCoversQuestion(gate)) {
      return NextResponse.json({ reply: UNKNOWN_REPLY, sources: [] });
    }

    const reply = await gemini.chat(buildChatMessages(message, hits));
    return NextResponse.json({
      reply,
      sources: hits.map((h) => ({
        title: h.chunk.title,
        url: h.chunk.url,
      })),
    });
  } catch (err) {
    console.error("chat error", err);
    return NextResponse.json(
      { error: "Chat temporarily unavailable" },
      { status: 503 }
    );
  }
}
