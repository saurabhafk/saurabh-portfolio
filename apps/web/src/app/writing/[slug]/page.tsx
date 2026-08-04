import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { getContent } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { writing } = getContent();
  return writing.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getContent().writing.find((w) => w.slug === slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function WritingDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getContent().writing.find((w) => w.slug === slug);
  if (!post) notFound();

  return (
    <main className="page">
      <Link href="/writing" className="back-link">
        ← All writing
      </Link>
      <header className="detail-header">
        <h1 className="detail-header__title">{post.title}</h1>
        <p className="detail-header__meta">{post.publishedAt}</p>
        <p className="detail-header__summary">{post.summary}</p>
        <ul className="tag-list">
          {post.tags.map((tag) => (
            <li key={tag} className="tag">
              <Link href={`/skills#${tag}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      </header>
      <MarkdownBody>{post.body}</MarkdownBody>
    </main>
  );
}
