import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function languageFromClassName(className?: string) {
  const match = /language-([\w+-]+)/.exec(className ?? "");
  return match?.[1] ?? null;
}

const components: Components = {
  code({ className, children, ...props }) {
    const language = languageFromClassName(className);
    const text = String(children).replace(/\n$/, "");
    const isBlock = language !== null || text.includes("\n");

    if (!isBlock) {
      return (
        <code className="md-inline-code" {...props}>
          {children}
        </code>
      );
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre({ children }) {
    const child = Array.isArray(children) ? children[0] : children;
    const className =
      child && typeof child === "object" && "props" in child
        ? String(
            (child as { props?: { className?: string } }).props?.className ?? ""
          )
        : "";
    const language = languageFromClassName(className) ?? "plain";

    return (
      <div className="md-code">
        <div className="md-code-bar">
          <span className="md-code-dots" aria-hidden>
            ● ● ●
          </span>
          <span className="md-code-lang">{language}</span>
        </div>
        <pre>{children}</pre>
      </div>
    );
  },
  table({ children }) {
    return (
      <div className="md-table">
        <div className="md-table-scroll">
          <table>{children}</table>
        </div>
      </div>
    );
  },
  h2({ children }) {
    return <h2 className="md-h2">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="md-h3">{children}</h3>;
  },
  hr() {
    return <hr className="md-hr" />;
  },
};

export function MarkdownBody({ content }: { content: string }) {
  return (
    <div className="prose-portfolio">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
