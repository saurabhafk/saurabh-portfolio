import type { Metadata } from "next";
import Link from "next/link";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Experience",
  description: "Work history and highlights from Saurabh's React Native career.",
};

export default function ExperiencePage() {
  const { experience } = getContent();
  const sorted = [...experience].sort((a, b) => b.start.localeCompare(a.start));

  return (
    <main className="page">
      <h1 className="page__title">Experience</h1>
      <p className="page__subtitle">
        Roles where I&apos;ve shipped mobile products and grown into full-stack work.
      </p>
      <div>
        {sorted.map((exp) => (
          <article key={exp.id} id={exp.id} className="experience-item">
            <h2 className="experience-item__role">{exp.title}</h2>
            <p className="experience-item__company">{exp.company}</p>
            <p className="experience-item__dates">
              {exp.start} — {exp.end}
            </p>
            <p>{exp.summary}</p>
            {exp.highlights.length > 0 && (
              <ul className="experience-item__highlights">
                {exp.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}
            <ul className="tag-list">
              {exp.stack.map((tag) => (
                <li key={tag} className="tag">
                  <Link href={`/skills#${tag}`}>{tag}</Link>
                </li>
              ))}
            </ul>
            {exp.body && <MarkdownBody>{exp.body}</MarkdownBody>}
          </article>
        ))}
      </div>
    </main>
  );
}
