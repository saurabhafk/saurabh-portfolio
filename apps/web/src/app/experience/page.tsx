import Link from "next/link";
import { TechBadge } from "@/components/icons/TechBadge";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const metadata = { title: "Experience" };

export default function ExperiencePage() {
  const { experience } = getContent();

  return (
    <main className="section-shell max-w-3xl">
      <Reveal>
        <p className="font-mono text-xs text-base-content/50">
          <span className="code-token-comment">{"// git log --author=Saurabh"}</span>
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold md:text-5xl">
          Experience
        </h1>
      </Reveal>

      <div className="mt-10 space-y-4">
        {experience.map((role, index) => (
          <Reveal key={role.id} delay={index * 0.05}>
            <article
              id={role.id}
              className="vscode-panel rounded-box scroll-mt-28 overflow-hidden"
            >
              <div className="border-base-300 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2 font-mono text-xs">
                <span className="code-token-fn">{role.id}.md</span>
                <span className="text-base-content/50">
                  {role.start} → {role.end}
                </span>
              </div>
              <div className="p-5 md:p-6">
                <h2 className="font-display text-2xl font-semibold">{role.title}</h2>
                <p className="text-secondary mt-1 font-medium">{role.company}</p>
                <p className="mt-3 text-base-content/70">{role.summary}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base-content/80">
                  {role.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {role.stack.map((tag) => (
                    <TechBadge
                      key={tag}
                      name={tag}
                      href={`/skills#${tag}`}
                    />
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
