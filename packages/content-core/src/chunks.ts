import type { ContentChunk, PortfolioContent } from "./types.js";

const MAX_CHUNK_CHARS = 3500;

function splitLongText(text: string, max = MAX_CHUNK_CHARS): string[] {
  if (text.length <= max) return [text];

  const byHeading = text.split(/(?=^##\s)/m).map((s) => s.trim()).filter(Boolean);
  if (byHeading.length > 1) {
    const parts: string[] = [];
    for (const section of byHeading) {
      if (section.length <= max) {
        parts.push(section);
      } else {
        parts.push(...windowText(section, max));
      }
    }
    return parts;
  }

  return windowText(text, max);
}

function windowText(text: string, max: number): string[] {
  const parts: string[] = [];
  for (let i = 0; i < text.length; i += max) {
    parts.push(text.slice(i, i + max));
  }
  return parts;
}

export function buildContentChunks(content: PortfolioContent): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  chunks.push({
    id: "about",
    title: content.about.title,
    url: "/about",
    sourceType: "about",
    text: [content.about.title, content.about.body].join("\n"),
  });

  for (const skill of content.skills) {
    const projects = skill.projectSlugs
      .map((slug) => content.projects.find((p) => p.slug === slug))
      .filter(Boolean);
    const writing = skill.writingSlugs
      .map((slug) => content.writing.find((w) => w.slug === slug))
      .filter(Boolean);

    const projectLines = projects.map(
      (p) =>
        `Used ${skill.name} on project ${p!.title} (/projects/${p!.slug}): ${p!.summary}`
    );
    const writingLines = writing.map(
      (w) =>
        `Wrote about ${skill.name} in ${w!.title} (/writing/${w!.slug}): ${w!.summary}`
    );

    chunks.push({
      id: skill.id,
      title: skill.name,
      url: `/skills#${skill.id}`,
      sourceType: "skill",
      text: [
        `Skill: ${skill.name}`,
        projectLines.length
          ? `Projects using ${skill.name}:`
          : `No linked projects for ${skill.name} yet.`,
        ...projectLines,
        ...writingLines,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  for (const project of content.projects) {
    const base = [
      project.title,
      project.summary,
      project.role,
      project.stack.join(", "),
    ]
      .filter(Boolean)
      .join("\n");
    const parts = splitLongText([base, project.body].filter(Boolean).join("\n"));
    parts.forEach((text, index) => {
      chunks.push({
        id: index === 0 ? project.slug : `${project.slug}-${index + 1}`,
        title: project.title,
        url: `/projects/${project.slug}`,
        sourceType: "project",
        text,
      });
    });
  }

  for (const exp of content.experience) {
    chunks.push({
      id: exp.id,
      title: `${exp.title} at ${exp.company}`,
      url: `/experience#${exp.id}`,
      sourceType: "experience",
      text: [
        exp.company,
        exp.title,
        exp.summary,
        exp.highlights.join(". "),
        exp.stack.join(", "),
        exp.body,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  for (const post of content.writing) {
    const header = [post.title, post.summary, post.tags.join(", ")]
      .filter(Boolean)
      .join("\n");
    const parts = splitLongText([header, post.body].filter(Boolean).join("\n\n"));
    parts.forEach((text, index) => {
      chunks.push({
        id: index === 0 ? post.slug : `${post.slug}-${index + 1}`,
        title: post.title,
        url: `/writing/${post.slug}`,
        sourceType: "writing",
        text,
      });
    });
  }

  for (const cert of content.certifications) {
    chunks.push({
      id: cert.id,
      title: cert.name,
      url: `/about#${cert.id}`,
      sourceType: "certification",
      text: [
        cert.name,
        cert.issuer,
        cert.issuedAt,
        cert.credentialId ?? "",
        cert.skills.join(", "),
        "Anthropic",
        "Claude",
        "certificate",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  return chunks;
}
