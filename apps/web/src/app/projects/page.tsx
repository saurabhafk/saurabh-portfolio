import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected React Native and full-stack projects by Saurabh.",
};

export default function ProjectsPage() {
  const { projects } = getContent();
  const sorted = [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured)
  );

  return (
    <main className="page">
      <h1 className="page__title">Projects</h1>
      <p className="page__subtitle">
        Mobile-first builds with real backend and state-management depth.
      </p>
      <ul className="content-list">
        {sorted.map((project) => (
          <li key={project.slug}>
            <Link href={`/projects/${project.slug}`} className="content-card">
              <h2 className="content-card__title">{project.title}</h2>
              <p className="content-card__meta">{project.role}</p>
              <p className="content-card__summary">{project.summary}</p>
              <ul className="tag-list">
                {project.stack.map((tag) => (
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
