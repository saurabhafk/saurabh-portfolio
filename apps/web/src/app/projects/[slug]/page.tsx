import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { getContent } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { projects } = getContent();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getContent().projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getContent().projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="page">
      <Link href="/projects" className="back-link">
        ← All projects
      </Link>
      <header className="detail-header">
        <h1 className="detail-header__title">{project.title}</h1>
        <p className="detail-header__meta">
          {project.role}
          {project.featured ? " · Featured" : ""}
        </p>
        <p className="detail-header__summary">{project.summary}</p>
        <ul className="tag-list">
          {project.stack.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
        {(project.links.repo || project.links.demo) && (
          <div className="detail-links">
            {project.links.repo && (
              <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
                Repository
              </a>
            )}
            {project.links.demo && (
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                Live demo
              </a>
            )}
          </div>
        )}
      </header>
      <MarkdownBody>{project.body}</MarkdownBody>
    </main>
  );
}
