export type Skill = {
  id: string;
  name: string;
  projectSlugs: string[];
  writingSlugs: string[];
};

export type Project = {
  title: string;
  slug: string;
  summary: string;
  stack: string[];
  role: string;
  links: { repo?: string | null; demo?: string | null };
  featured: boolean;
  order: number;
  body: string;
};

export type Experience = {
  company: string;
  title: string;
  start: string;
  end: string;
  summary: string;
  highlights: string[];
  stack: string[];
  body: string;
  id: string;
};

export type Writing = {
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  publishedAt: string;
  body: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  issuedAt: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
};

export type About = {
  title: string;
  body: string;
};

export type PortfolioContent = {
  about: About;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  writing: Writing[];
  certifications: Certification[];
  resumeTex?: string;
};

export type ContentChunk = {
  id: string;
  title: string;
  url: string;
  sourceType:
    | "about"
    | "skill"
    | "project"
    | "experience"
    | "writing"
    | "certification";
  text: string;
};
