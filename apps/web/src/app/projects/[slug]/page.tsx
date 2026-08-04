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
        <Link href="/projects" className="btn btn-ghost btn-sm mb-6">
          ← Projects
        </Link>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{project.title}</h1>
        <p className="mt-3 text-lg text-base-content/70">{project.summary}</p>
        <p className="mt-2 text-sm text-base-content/50">{project.role}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <Link key={tag} href={`/skills#${tag}`} className="badge badge-outline">
              {tag}
            </Link>
          ))}
        </div>
      </Reveal>
      <Reveal className="prose-portfolio mt-10" delay={0.1}>
        <MarkdownBody content={project.body} />
      </Reveal>
    </main>
  );
}
