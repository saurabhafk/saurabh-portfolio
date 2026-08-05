import Image from "next/image";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { SocialLink } from "@/components/icons/SocialLink";
import { TechBadge } from "@/components/icons/TechBadge";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/content";

export const metadata = { title: "About" };

function formatIssued(value: string) {
  const parts = value.split("-").map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  if (!year || !month) return value;
  const date = new Date(year, month - 1, day || 1);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    ...(day ? { day: "numeric" } : {}),
  });
}

export default function AboutPage() {
  const { about, certifications } = getContent();

  return (
    <main className="section-shell max-w-3xl space-y-6 pb-24">
      <Reveal>
        <div className="vscode-panel rounded-box overflow-hidden">
          <div className="border-base-300 border-b px-4 py-2 font-mono text-xs">
            <span className="code-token-string">&quot;about.md&quot;</span>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="ring-primary/30 relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2">
                <Image
                  src="/images/avatar.jpg"
                  alt="Saurabh Srivastava"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div>
                <p className="font-mono text-xs text-base-content/50">
                  @saurabhafk · India · Open to work
                </p>
                <h1 className="font-display mt-2 text-4xl font-bold">
                  {about.title}
                </h1>
                <p className="mt-2 text-base-content/70">
                  Software Engineer · React Native · Freelance Content Writer
                </p>
              </div>
            </div>
            <div className="prose-portfolio mt-6">
              <MarkdownBody content={about.body} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <SocialLink
                network="email"
                href="mailto:saurabhsri98@gmail.com"
                className="btn btn-primary gap-2"
              />
              <SocialLink
                network="linkedin"
                href="https://linkedin.com/in/saurabhafk"
                className="btn gap-2"
              />
              <SocialLink
                network="github"
                href="https://github.com/saurabhafk"
                className="btn btn-ghost gap-2"
              />
            </div>
          </div>
        </div>
      </Reveal>

      {certifications.length > 0 && (
        <Reveal delay={0.06}>
          <section
            id="certifications"
            className="vscode-panel rounded-box scroll-mt-28 overflow-hidden"
          >
            <div className="border-base-300 border-b px-4 py-2 font-mono text-xs">
              <span className="code-token-comment">
                {"// licenses & certifications"}
              </span>
            </div>
            <div className="p-6 md:p-8">
              <h2 className="font-display text-2xl font-semibold">
                Certifications
              </h2>
              <p className="mt-2 text-sm text-base-content/65">
                {certifications.length} verified credentials from Anthropic
                Education (Anthropic Academy).
              </p>

              <ul className="mt-6 space-y-4">
                {certifications.map((cert) => (
                  <li
                    key={cert.id}
                    id={cert.id}
                    className="border-base-300 bg-base-100 scroll-mt-28 rounded-box border p-4 md:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold">
                          {cert.name}
                        </h3>
                        <p className="mt-1 text-sm text-secondary">
                          {cert.issuer}
                        </p>
                        <p className="mt-1 font-mono text-xs text-base-content/50">
                          Issued {formatIssued(cert.issuedAt)}
                          {cert.credentialId
                            ? ` · ID ${cert.credentialId}`
                            : ""}
                        </p>
                      </div>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          Verify
                        </a>
                      )}
                    </div>
                    {cert.skills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {cert.skills.map((skill) => (
                          <TechBadge key={skill} name={skill} size="sm" />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>
      )}
    </main>
  );
}
