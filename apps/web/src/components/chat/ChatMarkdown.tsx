"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";

type ChatMarkdownProps = {
  content: string;
};

export function ChatMarkdown({ content }: ChatMarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        a: ({ href, children }) => {
          if (href?.startsWith("/")) {
            return (
              <Link href={href} className="link link-primary">
                {children}
              </Link>
            );
          }
          return (
            <a
              href={href}
              className="link link-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
