import Link from "next/link";
import { OpenChatButton } from "@/components/home/OpenChatButton";
import { SocialLink } from "@/components/icons/SocialLink";
import { TechBadge } from "@/components/icons/TechBadge";
import { TechIcon } from "@/components/icons/TechIcon";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export default function Home() {
  const { projects, experience, skills, about } = getContent();
  const featured = projects.filter((p) => p.featured);
  const companies = [...new Set(experience.map((e) => e.company))];

  return (
    <main>
      {/* Profile hero — Wall of Portfolios energy */}
      <section className="border-base-300 border-b">
        <div className="section-shell !py-14 md:!py-20">
          <Reveal>
            <div className="vscode-panel rounded-box overflow-hidden">
              <div className="border-base-300 bg-base-300/40 flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
                <span className="code-token-comment">{"// profile.ts"}</span>
                <span className="badge badge-sm badge-success badge-outline">
                  Open to work
                </span>
              </div>

              <div className="grid gap-8 p-6 md:grid-cols-[auto_1fr] md:p-10">
                <div className="bg-base-300 text-base-content/80 flex h-28 w-28 items-center justify-center rounded-full font-mono text-3xl md:h-36 md:w-36">
                  SS
                </div>

                <div>
                  <p className="font-mono text-xs text-base-content/50">
                    @saurabhafk · India
                  </p>
                  <h1 className="font-display mt-2 text-4xl font-bold tracking-tight md:text-6xl">
                    Saurabh Srivastava
                  </h1>
                  <p className="mt-2 flex items-center gap-2 text-xl text-base-content/80 md:text-2xl">
                    <TechIcon name="react-native" className="h-6 w-6 text-[#61DAFB]" />
                    React Native Engineer
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <div className="stats bg-base-100 border-base-300 stats-horizontal border shadow-none">
                      <div className="stat px-4 py-3">
                        <div className="stat-title text-xs">Experience</div>
                        <div className="stat-value text-primary text-2xl">3+</div>
                        <div className="stat-desc">years shipping apps</div>
                      </div>
                    </div>
                    <TechBadge name="react-native" size="md" className="badge-primary badge-outline" />
                    <TechBadge name="redux-toolkit" size="md" />
                    <TechBadge name="typescript" size="md" />
                  </div>

                  <p className="mt-6 max-w-2xl text-base leading-relaxed text-base-content/75 md:text-lg">
                    {about.body.split("\n\n")[0]}
                  </p>

                  <div className="mt-4">
                    <p className="font-mono text-xs text-base-content/50">
                      Experience includes
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {companies.map((company) => (
                        <span key={company} className="badge badge-neutral">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/projects" className="btn btn-primary">
                      View portfolio
                    </Link>
                    <OpenChatButton />
                    <SocialLink
                      network="email"
                      href="mailto:saurabhsri98@gmail.com"
                      label="Message"
                      className="btn btn-ghost gap-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Selected work */}
      <section className="section-shell" id="work">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-base-content/50">
                <span className="code-token-keyword">const</span> work = [
              </p>
              <h2 className="font-display mt-1 text-3xl font-semibold md:text-4xl">
                Selected work
              </h2>
            </div>
            <Link href="/projects" className="btn btn-sm btn-ghost font-mono">
              all projects →
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.06}>
              <Link
                href={`/projects/${project.slug}`}
                className="vscode-panel group rounded-box block overflow-hidden transition hover:-translate-y-0.5"
              >
                <div className="border-base-300 flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
                  <span className="code-token-string">
                    &quot;{project.slug}.tsx&quot;
                  </span>
                  <span className="text-base-content/40 group-hover:text-primary">
                    open
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {project.stack.slice(0, 4).map((tag) => (
                      <TechBadge key={tag} name={tag} />
                    ))}
                  </div>
                  <h3 className="font-display mt-3 text-2xl font-semibold">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-base-content/70">
                    {project.summary}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Experience strip */}
      <section className="section-shell !pt-0" id="experience">
        <Reveal>
          <p className="font-mono text-xs text-base-content/50">
            <span className="code-token-comment">{"// career.log"}</span>
          </p>
          <h2 className="font-display mt-1 mb-8 text-3xl font-semibold">
            Experience
          </h2>
        </Reveal>

        <div className="space-y-3">
          {experience.map((role, index) => (
            <Reveal key={role.id} delay={index * 0.04}>
              <Link
                href={`/experience#${role.id}`}
                className="vscode-panel rounded-box hover:border-primary/50 flex flex-col gap-2 border border-transparent p-4 transition md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-display text-lg font-semibold">
                    {role.title}
                  </div>
                  <div className="text-secondary text-sm">{role.company}</div>
                </div>
                <div className="font-mono text-xs text-base-content/50">
                  {role.start} → {role.end}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="section-shell !pt-0" id="skills">
        <Reveal>
          <p className="font-mono text-xs text-base-content/50">
            <span className="code-token-keyword">export</span>{" "}
            <span className="code-token-fn">skills</span>
          </p>
          <h2 className="font-display mt-1 mb-6 text-3xl font-semibold">
            Toolkit
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 12).map((skill) => (
              <TechBadge
                key={skill.id}
                name={skill.name}
                icon={skill.id}
                href={`/skills#${skill.id}`}
                size="lg"
                className="badge-outline font-mono hover:badge-primary"
              />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Ask CTA */}
      <section className="section-shell !pt-0 pb-24">
        <Reveal>
          <div className="vscode-panel rounded-box overflow-hidden">
            <div className="border-base-300 border-b px-4 py-2 font-mono text-xs">
              <span className="code-token-comment">
                {"// terminal · ask about this portfolio"}
              </span>
            </div>
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div>
                <h2 className="font-display text-2xl font-semibold md:text-3xl">
                  Has Saurabh worked with Redux Toolkit?
                </h2>
                <p className="mt-2 max-w-xl text-base-content/70">
                  Ask the in-editor chatbot — answers deep-link into projects,
                  skills, and writing.
                </p>
              </div>
              <OpenChatButton className="btn-primary" />
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
