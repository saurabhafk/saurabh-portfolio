"use client";

import Link from "next/link";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { sendChatMessage, type ChatSource } from "@/lib/api";
import { ChatMarkdown } from "./ChatMarkdown";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
};

const STARTER = "Has Saurabh worked with Redux Toolkit?";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("portfolio:open-chat", onOpen);
    return () => window.removeEventListener("portfolio:open-chat", onOpen);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open, loading]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text },
    ]);
    setLoading(true);

    try {
      const response = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.reply,
          sources: response.sources,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed right-4 bottom-8 z-80 flex flex-col items-end gap-2 sm:bottom-10">
      {open && (
        <section className="vscode-panel flex h-[min(32rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden shadow-2xl">
          <header className="border-base-300 bg-base-300/50 flex items-center justify-between border-b px-3 py-2">
            <div className="font-mono text-xs">
              <span className="code-token-comment">TERMINAL</span>
              <span className="text-base-content/50"> · ask-portfolio</span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </header>

          <div ref={listRef} className="bg-base-100 flex-1 space-y-3 overflow-y-auto p-3">
            {messages.length === 0 && (
              <div className="space-y-3 font-mono text-xs">
                <p className="code-token-comment">
                  {"// ask about skills, projects, experience"}
                </p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm h-auto w-full whitespace-normal py-2 text-left font-sans text-sm"
                  onClick={() => setInput(STARTER)}
                >
                  {STARTER}
                </button>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat ${message.role === "user" ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble text-sm ${
                    message.role === "user"
                      ? "chat-bubble-primary"
                      : "chat-bubble-neutral"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <ChatMarkdown content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
                {message.sources && message.sources.length > 0 && (
                  <div className="chat-footer mt-2 flex flex-wrap gap-2">
                    {message.sources.map((source) => (
                      <Link
                        key={`${message.id}-${source.url}`}
                        href={source.url}
                        className="badge badge-outline badge-sm font-mono"
                        onClick={() => setOpen(false)}
                      >
                        {source.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-neutral">
                  <span className="loading loading-dots loading-sm" />
                </div>
              </div>
            )}

            {error && (
              <div role="alert" className="alert alert-error alert-soft text-sm">
                <span>{error}</span>
              </div>
            )}
          </div>

          <form
            className="border-base-300 bg-base-200 flex gap-2 border-t p-2"
            onSubmit={handleSubmit}
          >
            <label className="sr-only" htmlFor={inputId}>
              Your question
            </label>
            <span className="text-accent hidden items-center font-mono text-sm sm:flex">
              ›
            </span>
            <input
              id={inputId}
              className="input input-sm input-bordered w-full font-mono"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="ask about Redux, RN, APIs…"
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading || !input.trim()}
            >
              Run
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="btn btn-primary btn-sm shadow-lg font-mono"
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "close" : ">_ ask"}
      </button>
    </div>
  );
}
