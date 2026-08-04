import type { Metadata } from "next";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "About Saurabh — React Native engineer growing into backend and AI.",
};

export default function AboutPage() {
  const { about } = getContent();

  return (
    <main className="page">
      <h1 className="page__title">{about.title}</h1>
      <MarkdownBody>{about.body}</MarkdownBody>
    </main>
  );
}
