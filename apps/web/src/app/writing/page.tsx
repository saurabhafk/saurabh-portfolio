import Link from "next/link";
import { TechBadge } from "@/components/icons/TechBadge";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const metadata = { title: "Writing" };

function formatDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function WritingPage() {
  const { writing } = getContent();
  const posts = [...writing].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );

  return (
    <main className="section-shell max-w-3xl">
      <Reveal>
        <p className="font-mono text-xs text-base-content/50">
          <span className="code-token-comment">{"// notes.md"}</span>
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold">Writing</h1>
        <p className="mt-3 max-w-xl text-base-content/65">
          Notes from shipping React Native apps — architecture, state, and
          on-device ML.
        </p>
      </Reveal>

      <div className="mt-10 space-y-4">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.05}>
            <Link
              href={`/writing/${post.slug}`}
              className="vscode-panel group rounded-box block transition hover:-translate-y-0.5"
            >
              <div className="border-base-300 flex items-center justify-between gap-3 border-b px-5 py-2.5 font-mono text-xs">
                <span className="code-token-string truncate">
                  &quot;{post.slug}.md&quot;
                </span>
                {post.publishedAt && (
                  <span className="text-base-content/45 shrink-0">
                    {formatDate(post.publishedAt)}
                  </span>
                )}
              </div>
              <div className="p-5 md:p-6">
                <h2 className="font-display text-2xl font-semibold tracking-tight group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-base-content/70">
                  {post.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <TechBadge key={tag} name={tag} />
                  ))}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
