import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { TechBadge } from "@/components/icons/TechBadge";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getContent().writing.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getContent().writing.find((w) => w.slug === slug);
  return { title: post?.title ?? "Writing" };
}

function formatDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function WritingDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getContent().writing.find((w) => w.slug === slug);
  if (!post) notFound();

  return (
    <main className="section-shell max-w-3xl pb-24">
      <Reveal>
        <Link href="/writing" className="btn btn-ghost btn-sm mb-6 font-mono">
          ← writing/
        </Link>

        <article className="blog-article">
          <header className="blog-header">
            <div className="border-base-300 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2 font-mono text-xs md:px-5">
              <span className="code-token-string">
                &quot;{post.slug}.md&quot;
              </span>
              {post.publishedAt && (
                <time
                  dateTime={post.publishedAt}
                  className="text-base-content/45"
                >
                  {formatDate(post.publishedAt)}
                </time>
              )}
            </div>

            <div className="px-4 py-6 md:px-8 md:py-8">
              <p className="font-mono text-xs text-base-content/45">
                <span className="code-token-comment">{"// blog post"}</span>
              </p>
              <h1 className="font-display mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-base-content/70 md:text-lg">
                {post.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <TechBadge
                    key={tag}
                    name={tag}
                    href={`/skills#${tag}`}
                    size="md"
                  />
                ))}
              </div>
            </div>
          </header>

          <div className="blog-body">
            <MarkdownBody content={post.body} />
          </div>
        </article>
      </Reveal>
    </main>
  );
}
