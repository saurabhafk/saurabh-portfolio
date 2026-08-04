import { MarkdownBody } from "@/components/content/MarkdownBody";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const metadata = { title: "About" };

export default function AboutPage() {
  const { about } = getContent();

  return (
    <main className="section-shell max-w-3xl">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.2em] text-base-content/50">Profile</p>
        <h1 className="font-display mt-2 text-4xl font-bold md:text-5xl">{about.title}</h1>
      </Reveal>
      <Reveal className="prose-portfolio mt-10" delay={0.08}>
        <MarkdownBody content={about.body} />
      </Reveal>
      <Reveal className="mt-10 flex flex-wrap gap-3" delay={0.12}>
        <a href="mailto:saurabhsri98@gmail.com" className="btn btn-primary">
          Email Saurabh
        </a>
        <a
          href="https://linkedin.com/in/saurabhafk"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/saurabhafk"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          GitHub
        </a>
      </Reveal>
    </main>
  );
}
