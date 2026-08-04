import Link from "next/link";
import { OpenChatButton } from "@/components/home/OpenChatButton";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export default function Home() {
  const { projects, experience, skills, about } = getContent();
  const featured = projects.filter((p) => p.featured);
  const topSkills = skills.slice(0, 8);

  return (
    <main>
      <section className="hero min-h-[92vh]">
        <div className="hero-content flex-col items-start gap-8 py-20 lg:max-w-4xl">
          <Reveal>
            <div className="badge badge-primary badge-outline mb-2">
              React Native · Full-stack path
            </div>
            <h1 className="font-display text-5xl font-extrabold tracking-tight md:text-7xl">
              Saurabh
            </h1>
            <p className="font-display mt-4 max-w-2xl text-2xl font-semibold text-base-content/90 md:text-3xl">
              React Native apps, with a backend/AI path
            </p>
            <p className="mt-4 max-w-2xl text-lg text-base-content/70">
              {about.body.split("\n\n")[0]}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="btn btn-primary">
                View projects
              </Link>
              <OpenChatButton />
              <Link href="/experience" className="btn btn-ghost">
                Experience
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell" id="work">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-base-content/50">
                Selected work
              </p>
              <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">
                Apps shipped in production
              </h2>
            </div>
            <Link href="/projects" className="btn btn-sm hidden sm:inline-flex">
              All projects
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.08}>
              <Link
                href={`/projects/${project.slug}`}
                className="card bg-base-200/80 border-base-300 hover:border-primary/40 h-full border transition duration-300 hover:-translate-y-1"
              >
                <div className="card-body">
                  <div className="flex flex-wrap gap-2">
                    {project.stack.slice(0, 3).map((tag) => (
                      <span key={tag} className="badge badge-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="card-title font-display mt-2">{project.title}</h3>
                  <p className="text-base-content/70">{project.summary}</p>
                  <div className="card-actions mt-4 justify-end">
                    <span className="link link-primary text-sm">Read case</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell pt-0" id="experience">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.2em] text-base-content/50">
            Experience
          </p>
          <h2 className="font-display mt-2 mb-10 text-3xl font-bold md:text-4xl">
            3+ years building mobile products
          </h2>
        </Reveal>

        <ul className="timeline timeline-vertical timeline-snap-icon max-md:timeline-compact">
          {experience.map((role, index) => (
            <li key={role.id}>
              {index > 0 && <hr className="bg-primary/40" />}
              <div className="timeline-middle">
                <span className="bg-primary status status-lg" />
              </div>
              <div
                className={`timeline-box bg-base-200/80 border-base-300 mb-8 border ${
                  index % 2 === 0 ? "timeline-start md:text-end" : "timeline-end"
                }`}
              >
                <Reveal delay={0.05}>
                  <time className="text-xs text-base-content/50">
                    {role.start} — {role.end}
                  </time>
                  <div className="font-display text-xl font-bold">{role.title}</div>
                  <div className="text-primary font-medium">{role.company}</div>
                  <p className="mt-2 text-sm text-base-content/70">{role.summary}</p>
                </Reveal>
              </div>
              {index < experience.length - 1 && <hr className="bg-primary/40" />}
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <Link href="/experience" className="btn btn-outline btn-sm">
            Full experience
          </Link>
        </div>
      </section>

      <section className="section-shell pt-0" id="skills">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.2em] text-base-content/50">
            Skills
          </p>
          <h2 className="font-display mt-2 mb-8 text-3xl font-bold md:text-4xl">
            What I use day to day
          </h2>
        </Reveal>
        <Reveal>
          <div className="flex flex-wrap gap-2">
            {topSkills.map((skill) => (
              <Link
                key={skill.id}
                href={`/skills#${skill.id}`}
                className="badge badge-lg badge-outline hover:badge-primary transition"
              >
                {skill.name}
              </Link>
            ))}
          </div>
          <Link href="/skills" className="btn btn-ghost btn-sm mt-6">
            Browse all skills
          </Link>
        </Reveal>
      </section>

      <section className="section-shell pt-0 pb-28">
        <Reveal>
          <div className="bg-base-200/80 border-base-300 rounded-box flex flex-col items-start gap-6 border p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="font-display text-3xl font-bold">
                Ask anything about this portfolio
              </h2>
              <p className="mt-2 max-w-xl text-base-content/70">
                Try “Has Saurabh worked with Redux Toolkit?” — the chat deep-links
                into the right project or skill.
              </p>
            </div>
            <OpenChatButton className="btn-primary" />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
