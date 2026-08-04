import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const metadata = { title: "Experience" };

export default function ExperiencePage() {
  const { experience } = getContent();

  return (
    <main className="section-shell max-w-4xl">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.2em] text-base-content/50">Career</p>
        <h1 className="font-display mt-2 text-4xl font-bold md:text-5xl">Experience</h1>
      </Reveal>

      <div className="mt-12 space-y-6">
        {experience.map((role, index) => (
          <Reveal key={role.id} delay={index * 0.05}>
            <article
              id={role.id}
              className="card bg-base-200/80 border-base-300 scroll-mt-28 border"
            >
              <div className="card-body">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-bold">{role.title}</h2>
                    <p className="text-primary font-medium">{role.company}</p>
                  </div>
                  <span className="badge badge-ghost">
                    {role.start} — {role.end}
                  </span>
                </div>
                <p className="text-base-content/70">{role.summary}</p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-base-content/80">
                  {role.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {role.stack.map((tag) => (
                    <Link key={tag} href={`/skills#${tag}`} className="badge badge-outline badge-sm">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
