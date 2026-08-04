import ReactMarkdown from "react-markdown";

export function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="prose-portfolio">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
