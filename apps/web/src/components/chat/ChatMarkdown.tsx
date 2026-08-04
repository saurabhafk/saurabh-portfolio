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
            return <Link href={href}>{children}</Link>;
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
