import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  const { projects } = getContent();

  return (
    <main className="section-shell">
      <Reveal>
        <p className="font-mono text-xs text-base-content/50">
          <span className="code-token-keyword">import</span> work{" "}
          <span className="code-token-keyword">from</span>{" "}
          <span className="code-token-string">&quot;./shipped&quot;</span>
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold md:text-5xl">
          Portfolio
        </h1>
        <p className="mt-3 max-w-2xl text-base-content/70">
          Case studies from production React Native apps — healthcare, logistics,
          consumer, and booking.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.05}>
            <Link
              href={`/projects/${project.slug}`}
              className="vscode-panel rounded-box block overflow-hidden transition hover:-translate-y-0.5"
            >
              <div className="border-base-300 flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
                <span className="code-token-string">
                  &quot;{project.slug}.tsx&quot;
                </span>
                {project.featured && (
                  <span className="badge badge-primary badge-xs">featured</span>
                )}
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {project.stack.slice(0, 4).map((tag) => (
                    <span key={tag} className="badge badge-sm badge-outline font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-display mt-3 text-2xl font-semibold">
                  {project.title}
                </h2>
                <p className="mt-2 text-sm text-base-content/70">{project.summary}</p>
                <p className="mt-3 font-mono text-xs text-base-content/45">
                  {project.role}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
