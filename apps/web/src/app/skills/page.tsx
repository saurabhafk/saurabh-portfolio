import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const metadata = { title: "Skills" };

export default function SkillsPage() {
  const { skills, projects, writing } = getContent();

  return (
    <main className="section-shell">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.2em] text-base-content/50">Toolkit</p>
        <h1 className="font-display mt-2 text-4xl font-bold md:text-5xl">Skills</h1>
        <p className="mt-3 max-w-2xl text-base-content/70">
          Ask the portfolio chatbot about any of these — answers deep-link here and into related work.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {skills.map((skill, index) => {
          const relatedProjects = projects.filter((p) =>
            skill.projectSlugs.includes(p.slug)
          );
          const relatedWriting = writing.filter((w) =>
            skill.writingSlugs.includes(w.slug)
          );

          return (
            <Reveal key={skill.id} delay={index * 0.03}>
              <article
                id={skill.id}
                className="card bg-base-200/80 border-base-300 scroll-mt-28 border"
              >
                <div className="card-body">
                  <h2 className="card-title font-display">{skill.name}</h2>
                  {relatedProjects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {relatedProjects.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/projects/${p.slug}`}
                          className="badge badge-primary badge-outline"
                        >
                          {p.title}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-base-content/60">
                      Documented capability from day-to-day RN engineering work.
                    </p>
                  )}
                  {relatedWriting.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/writing/${post.slug}`}
                      className="link link-hover text-sm"
                    >
                      Writing: {post.title}
                    </Link>
                  ))}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
