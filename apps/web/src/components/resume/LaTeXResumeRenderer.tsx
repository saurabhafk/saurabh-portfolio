import React from "react";

function cleanTex(str: string): string {
  return str
    .replace(/\\&/g, "&")
    .replace(/\\%/g, "%")
    .replace(/\\\$/g, "$")
    .replace(/\\#/g, "#")
    .replace(/\\_/g, "_")
    .replace(/---/g, "—")
    .replace(/--/g, "–")
    .replace(/\\enspace/g, " | ")
    .replace(/\\vspace\{[^}]*\}/g, "")
    .replace(/\\hrule/g, "");
}

function parseInlineTex(str: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let remaining = str;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Check href: \href{url}{text}
    const hrefMatch = /^\\href\{([^}]+)\}\{([^}]+)\}/.exec(remaining);
    if (hrefMatch) {
      const [, url, text] = hrefMatch;
      nodes.push(
        <a
          key={keyIdx++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="link link-primary font-medium hover:underline"
        >
          {parseInlineTex(text)}
        </a>
      );
      remaining = remaining.slice(hrefMatch[0].length);
      continue;
    }

    // Check textbf: \textbf{text}
    const boldMatch = /^\\textbf\{([^}]+)\}/.exec(remaining);
    if (boldMatch) {
      nodes.push(
        <strong key={keyIdx++} className="font-semibold text-base-content">
          {parseInlineTex(boldMatch[1])}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Check textit: \textit{text}
    const italicMatch = /^\\textit\{([^}]+)\}/.exec(remaining);
    if (italicMatch) {
      nodes.push(
        <em key={keyIdx++} className="italic text-secondary font-mono text-xs">
          {parseInlineTex(italicMatch[1])}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Find next control sequence or literal char
    const nextIdx = remaining.search(/\\(href|textbf|textit)\{/);
    if (nextIdx === -1) {
      nodes.push(cleanTex(remaining));
      break;
    } else if (nextIdx > 0) {
      nodes.push(cleanTex(remaining.slice(0, nextIdx)));
      remaining = remaining.slice(nextIdx);
    } else {
      // Fallback one char
      nodes.push(cleanTex(remaining[0]));
      remaining = remaining.slice(1);
    }
  }

  return nodes;
}

export function LaTeXResumeRenderer({ latex }: { latex: string }) {
  // Extract body between \begin{document} and \end{document}
  const bodyMatch = /\\begin\{document\}([\s\S]*?)\\end\{document\}/.exec(latex);
  const rawBody = bodyMatch ? bodyMatch[1] : latex;

  // Split into sections or blocks
  const sections = rawBody.split(/\\section\*\{([^}]+)\}/);

  const headerRaw = sections[0] ?? "";

  // Parse header center block
  const centerMatch = /\\begin\{center\}([\s\S]*?)\\end\{center\}/.exec(headerRaw);
  const headerContent = centerMatch ? centerMatch[1] : headerRaw;

  // Extract name and subtitle/contacts
  const nameMatch = /\{\\Huge \\textbf\{([^}]+)\}\}/.exec(headerContent);
  const name = nameMatch ? nameMatch[1] : "Saurabh Srivastava";

  const contactLines = headerContent
    .replace(/\{\\Huge \\textbf\{[^}]+\}\}(\\\[[^\]]*\])?/, "")
    .split("\\\\")
    .map((l) => l.trim())
    .filter(Boolean);

  const sectionBlocks: { title: string; content: string }[] = [];
  for (let i = 1; i < sections.length; i += 2) {
    sectionBlocks.push({
      title: sections[i],
      content: sections[i + 1] ?? "",
    });
  }

  return (
    <div className="space-y-8">
      {/* Header Block */}
      <header className="vscode-panel rounded-box p-6 md:p-8 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
          {name}
        </h1>
        {contactLines.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 font-mono text-xs text-base-content/75">
            {contactLines.map((line, idx) => (
              <span key={idx} className="inline-flex items-center gap-2">
                {parseInlineTex(line)}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Sections */}
      {sectionBlocks.map((sec, idx) => {
        const title = sec.title.trim();
        const content = sec.content.trim();

        // Check if content has itemize lists
        const items: string[] = [];
        const itemizeMatch = /\\begin\{itemize\}[^]*?\\end\{itemize\}/.exec(content);

        let bodyParagraph = content;
        if (itemizeMatch) {
          bodyParagraph = content.slice(0, itemizeMatch.index).trim();
          const itemizeInner = itemizeMatch[0]
            .replace(/\\begin\{itemize\}[^]*?\]/, "")
            .replace(/\\end\{itemize\}/, "");
          const rawItems = itemizeInner.split(/\\item\s+/).map((s) => s.trim()).filter(Boolean);
          items.push(...rawItems);
        }

        // Check for \hfill lines (like experience or project headers)
        const lines = bodyParagraph
          .split(/\\\\|\n\n+/)
          .map((l) => l.trim())
          .filter(Boolean);

        return (
          <section key={idx} className="vscode-panel rounded-box p-6 md:p-8">
            <h2 className="font-display text-xl font-bold uppercase tracking-wider text-primary border-b border-base-300 pb-3 mb-5">
              {title}
            </h2>

            {lines.length > 0 && (
              <div className="space-y-4">
                {lines.map((line, lIdx) => {
                  if (line.includes("\\hfill")) {
                    const parts = line.split("\\hfill").map((p) => p.trim());
                    return (
                      <div
                        key={lIdx}
                        className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="font-display text-base font-semibold">
                          {parseInlineTex(parts[0])}
                        </div>
                        {parts[1] && (
                          <div className="font-mono text-xs text-primary">
                            {parseInlineTex(parts[1])}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={lIdx}
                      className="text-base leading-relaxed text-base-content/85"
                    >
                      {parseInlineTex(line)}
                    </div>
                  );
                })}
              </div>
            )}

            {items.length > 0 && (
              <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-base-content/80">
                {items.map((item, iIdx) => (
                  <li key={iIdx}>{parseInlineTex(item)}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
