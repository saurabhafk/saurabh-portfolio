import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical skills and related projects by Saurabh.",
};

export default function SkillsPage() {
  const { skills } = getContent();

  return (
    <main className="page">
      <h1 className="page__title">Skills</h1>
      <p className="page__subtitle">
        Core technologies I use in production — each linked to real project work.
      </p>
      <div>
        {skills.map((skill) => (
          <section key={skill.id} id={skill.id} className="skill-item">
            <h2 className="skill-item__name">{skill.name}</h2>
            {skill.projectSlugs.length > 0 && (
              <div className="skill-item__links">
                <span style={{ color: "var(--text-muted)" }}>Projects:</span>
                {skill.projectSlugs.map((slug) => (
                  <Link key={slug} href={`/projects/${slug}`}>
                    {slug}
                  </Link>
                ))}
              </div>
            )}
            {skill.writingSlugs.length > 0 && (
              <div className="skill-item__links" style={{ marginTop: "0.5rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Writing:</span>
                {skill.writingSlugs.map((slug) => (
                  <Link key={slug} href={`/writing/${slug}`}>
                    {slug}
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
