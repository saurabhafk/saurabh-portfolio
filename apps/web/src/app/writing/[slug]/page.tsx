import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/content/MarkdownBody";
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

export default async function WritingDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getContent().writing.find((w) => w.slug === slug);
  if (!post) notFound();

  return (
    <main className="section-shell max-w-3xl">
      <Reveal>
        <Link href="/writing" className="btn btn-ghost btn-sm mb-6">
          ← Writing
        </Link>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{post.title}</h1>
        <p className="mt-3 text-base-content/70">{post.summary}</p>
      </Reveal>
      <Reveal className="prose-portfolio mt-10" delay={0.08}>
        <MarkdownBody content={post.body} />
      </Reveal>
    </main>
  );
}
