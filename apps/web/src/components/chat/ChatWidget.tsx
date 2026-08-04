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
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);
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
      const message =
        err instanceof Error ? err.message : "Chat request failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function askStarter() {
    setInput(STARTER);
  }

  return (
    <div className="chat-widget">
      {open && (
        <section
          className="chat-panel"
          aria-label="Ask about Saurabh's work"
        >
          <header className="chat-panel__header">
            <div>
              <p className="chat-panel__title">Ask the portfolio</p>
              <p className="chat-panel__subtitle">
                Answers link into projects, skills, and writing
              </p>
            </div>
            <button
              type="button"
              className="chat-panel__close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="chat-panel__messages" ref={listRef}>
            {messages.length === 0 && (
              <div className="chat-empty">
                <p>Ask about skills, projects, or experience.</p>
                <button
                  type="button"
                  className="chat-starter"
                  onClick={askStarter}
                >
                  {STARTER}
                </button>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-bubble chat-bubble--${message.role}`}
              >
                {message.role === "assistant" ? (
                  <ChatMarkdown content={message.content} />
                ) : (
                  <p>{message.content}</p>
                )}
                {message.sources && message.sources.length > 0 && (
                  <div className="chat-sources">
                    {message.sources.map((source) => (
                      <Link
                        key={`${message.id}-${source.url}`}
                        href={source.url}
                        className="chat-source-chip"
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
              <p className="chat-status" role="status">
                Thinking…
              </p>
            )}
            {error && (
              <p className="chat-error" role="alert">
                {error}
              </p>
            )}
          </div>

          <form className="chat-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor={inputId}>
              Your question
            </label>
            <input
              id={inputId}
              className="chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about Redux, React Native, APIs…"
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="btn btn--primary chat-send"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chat-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? "Close" : "Ask"}
      </button>
    </div>
  );
}
