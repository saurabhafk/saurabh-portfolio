import { MarkdownBody } from "@/components/content/MarkdownBody";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const metadata = { title: "About" };

export default function AboutPage() {
  const { about } = getContent();

  return (
    <main className="section-shell max-w-3xl">
      <Reveal>
        <div className="vscode-panel rounded-box overflow-hidden">
          <div className="border-base-300 border-b px-4 py-2 font-mono text-xs">
            <span className="code-token-string">&quot;about.md&quot;</span>
          </div>
          <div className="p-6 md:p-8">
            <p className="font-mono text-xs text-base-content/50">
              @saurabhafk · India · Open to work
            </p>
            <h1 className="font-display mt-2 text-4xl font-bold">{about.title}</h1>
            <div className="prose-portfolio mt-6">
              <MarkdownBody content={about.body} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="mailto:saurabhsri98@gmail.com" className="btn btn-primary">
                Email
              </a>
              <a
                href="https://linkedin.com/in/saurabhafk"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/saurabhafk"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
