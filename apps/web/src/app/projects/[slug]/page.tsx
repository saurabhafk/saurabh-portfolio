import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getContent().projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getContent().projects.find((p) => p.slug === slug);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getContent().projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="section-shell max-w-3xl">
      <Reveal>
        <Link href="/projects" className="btn btn-ghost btn-sm mb-6 font-mono">
          ← projects/
        </Link>
        <div className="vscode-panel rounded-box overflow-hidden">
          <div className="border-base-300 border-b px-4 py-2 font-mono text-xs">
            <span className="code-token-string">
              &quot;{project.slug}.tsx&quot;
            </span>
          </div>
          <div className="p-6 md:p-8">
            <h1 className="font-display text-4xl font-bold">{project.title}</h1>
            <p className="mt-3 text-lg text-base-content/70">{project.summary}</p>
            <p className="mt-2 font-mono text-xs text-base-content/50">
              {project.role}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((tag) => (
                <Link
                  key={tag}
                  href={`/skills#${tag}`}
                  className="badge badge-outline font-mono"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal className="prose-portfolio mt-8" delay={0.08}>
        <MarkdownBody content={project.body} />
      </Reveal>
    </main>
  );
}
