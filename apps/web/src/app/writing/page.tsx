import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const metadata = { title: "Writing" };

export default function WritingPage() {
  const { writing } = getContent();

  return (
    <main className="section-shell max-w-3xl">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.2em] text-base-content/50">Notes</p>
        <h1 className="font-display mt-2 text-4xl font-bold md:text-5xl">Writing</h1>
      </Reveal>
      <div className="mt-10 space-y-4">
        {writing.map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.05}>
            <Link
              href={`/writing/${post.slug}`}
              className="card bg-base-200/80 border-base-300 block border transition hover:-translate-y-0.5"
            >
              <div className="card-body">
                <h2 className="card-title font-display">{post.title}</h2>
                <p className="text-base-content/70">{post.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="badge badge-sm badge-outline">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
