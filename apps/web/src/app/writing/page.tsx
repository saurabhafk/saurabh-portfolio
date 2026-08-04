import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Technical writing and deep dives by Saurabh.",
};

export default function WritingPage() {
  const { writing } = getContent();
  const sorted = [...writing].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );

  return (
    <main className="page">
      <h1 className="page__title">Writing</h1>
      <p className="page__subtitle">
        Notes on mobile architecture, state management, and full-stack patterns.
      </p>
      <ul className="content-list">
        {sorted.map((post) => (
          <li key={post.slug}>
            <Link href={`/writing/${post.slug}`} className="content-card">
              <h2 className="content-card__title">{post.title}</h2>
              <p className="content-card__meta">{post.publishedAt}</p>
              <p className="content-card__summary">{post.summary}</p>
              <ul className="tag-list">
                {post.tags.map((tag) => (
                  <li key={tag} className="tag">
                    {tag}
                  </li>
                ))}
              </ul>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
