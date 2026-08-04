import type { ContentChunk, PortfolioContent } from "./types.js";

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
    chunks.push({
      id: skill.id,
      title: skill.name,
      url: `/skills#${skill.id}`,
      sourceType: "skill",
      text: skill.name,
    });
  }

  for (const project of content.projects) {
    chunks.push({
      id: project.slug,
      title: project.title,
      url: `/projects/${project.slug}`,
      sourceType: "project",
      text: [
        project.title,
        project.summary,
        project.role,
        project.stack.join(", "),
        project.body,
      ]
        .filter(Boolean)
        .join("\n"),
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
    chunks.push({
      id: post.slug,
      title: post.title,
      url: `/writing/${post.slug}`,
      sourceType: "writing",
      text: [post.title, post.summary, post.tags.join(", "), post.body]
        .filter(Boolean)
        .join("\n"),
    });
  }

  return chunks;
}
