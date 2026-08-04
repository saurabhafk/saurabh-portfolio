import ReactMarkdown from "react-markdown";

type MarkdownBodyProps = {
  children: string;
};

export function MarkdownBody({ children }: MarkdownBodyProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
