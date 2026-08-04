import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  const { projects } = getContent();

  return (
    <main className="section-shell">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.2em] text-base-content/50">Work</p>
        <h1 className="font-display mt-2 text-4xl font-bold md:text-5xl">Projects</h1>
        <p className="mt-3 max-w-2xl text-base-content/70">
          Production React Native apps across healthcare, logistics, consumer, and booking.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 0.06}>
            <Link
              href={`/projects/${project.slug}`}
              className="card bg-base-200/80 border-base-300 hover:border-primary/40 h-full border transition hover:-translate-y-1"
            >
              <div className="card-body">
                <div className="flex flex-wrap gap-2">
                  {project.featured && <span className="badge badge-primary">Featured</span>}
                  {project.stack.slice(0, 4).map((tag) => (
                    <span key={tag} className="badge badge-outline badge-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="card-title font-display">{project.title}</h2>
                <p className="text-base-content/70">{project.summary}</p>
                <p className="text-sm text-base-content/50">{project.role}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
