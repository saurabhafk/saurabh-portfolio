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
    <div className="fixed right-4 bottom-4 z-80 flex flex-col items-end gap-3">
      {open && (
        <section className="card bg-base-200 border-base-300 h-[min(32rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] border shadow-2xl">
          <div className="card-body gap-0 p-0">
            <header className="border-base-300 flex items-start justify-between gap-3 border-b p-4">
              <div>
                <h2 className="font-display font-bold">Ask the portfolio</h2>
                <p className="text-xs text-base-content/60">
                  Answers deep-link into your work
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-base-content/70">
                    Ask about skills, projects, or experience.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm h-auto whitespace-normal py-2 text-left"
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
                          className="badge badge-outline badge-sm"
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
              className="border-base-300 join border-t p-3"
              onSubmit={handleSubmit}
            >
              <label className="sr-only" htmlFor={inputId}>
                Your question
              </label>
              <input
                id={inputId}
                className="input join-item input-bordered w-full"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about Redux, RN, APIs…"
                disabled={loading}
                autoComplete="off"
              />
              <button
                type="submit"
                className="btn btn-primary join-item"
                disabled={loading || !input.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        className="btn btn-primary btn-lg shadow-xl"
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Ask"}
      </button>
    </div>
  );
}
