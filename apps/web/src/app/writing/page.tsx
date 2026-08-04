import Link from "next/link";
import { TechBadge } from "@/components/icons/TechBadge";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const metadata = { title: "Writing" };

export default function WritingPage() {
  const { writing } = getContent();

  return (
    <main className="section-shell max-w-3xl">
      <Reveal>
        <p className="font-mono text-xs text-base-content/50">
          <span className="code-token-comment">{"// notes.md"}</span>
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold">Writing</h1>
      </Reveal>
      <div className="mt-10 space-y-3">
        {writing.map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.05}>
            <Link
              href={`/writing/${post.slug}`}
              className="vscode-panel rounded-box block p-5 transition hover:-translate-y-0.5"
            >
              <h2 className="font-display text-2xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-base-content/70">{post.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <TechBadge key={tag} name={tag} />
                ))}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
