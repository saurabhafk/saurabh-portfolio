import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const metadata = { title: "Skills" };

export default function SkillsPage() {
  const { skills, projects, writing } = getContent();

  return (
    <main className="section-shell">
      <Reveal>
        <p className="font-mono text-xs text-base-content/50">
          <span className="code-token-keyword">type</span>{" "}
          <span className="code-token-fn">Skill</span> = string;
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold md:text-5xl">
          Skills
        </h1>
        <p className="mt-3 max-w-2xl text-base-content/70">
          Ask the chatbot about any skill — answers deep-link here and into related
          work.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {skills.map((skill, index) => {
          const relatedProjects = projects.filter((p) =>
            skill.projectSlugs.includes(p.slug)
          );
          const relatedWriting = writing.filter((w) =>
            skill.writingSlugs.includes(w.slug)
          );

          return (
            <Reveal key={skill.id} delay={index * 0.02}>
              <article
                id={skill.id}
                className="vscode-panel rounded-box scroll-mt-28 p-5"
              >
                <h2 className="font-display text-xl font-semibold">{skill.name}</h2>
                <p className="mt-1 font-mono text-xs text-base-content/45">
                  id: {skill.id}
                </p>
                {relatedProjects.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
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
                  <p className="mt-3 text-sm text-base-content/60">
                    Used across day-to-day React Native engineering.
                  </p>
                )}
                {relatedWriting.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/writing/${post.slug}`}
                    className="link link-hover mt-3 block text-sm"
                  >
                    Writing: {post.title}
                  </Link>
                ))}
              </article>
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
