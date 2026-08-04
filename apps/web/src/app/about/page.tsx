import { MarkdownBody } from "@/components/content/MarkdownBody";
import { SocialLink } from "@/components/icons/SocialLink";
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
              <SocialLink
                network="email"
                href="mailto:saurabhsri98@gmail.com"
                className="btn btn-primary gap-2"
              />
              <SocialLink
                network="linkedin"
                href="https://linkedin.com/in/saurabhafk"
                className="btn gap-2"
              />
              <SocialLink
                network="github"
                href="https://github.com/saurabhafk"
                className="btn btn-ghost gap-2"
              />
            </div>
          </div>
        </div>
      </Reveal>
    </main>
  );
}
