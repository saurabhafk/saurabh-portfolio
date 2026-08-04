import type { IconType } from "react-icons";
import {
  SiApple,
  SiExpo,
  SiFirebase,
  SiGithub,
  SiGithubactions,
  SiGooglemaps,
  SiGraphql,
  SiJavascript,
  SiJest,
  SiOpenapiinitiative,
  SiReact,
  SiRedux,
  SiTypescript,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import {
  HiOutlineBell,
  HiOutlineBeaker,
  HiOutlineLink,
  HiOutlineVideoCamera,
} from "react-icons/hi2";
import { MdOutlineEmail } from "react-icons/md";

export type TechKey =
  | "react"
  | "react-native"
  | "typescript"
  | "javascript"
  | "redux"
  | "redux-toolkit"
  | "rest-apis"
  | "graphql"
  | "firebase"
  | "push-notifications"
  | "deep-linking"
  | "in-app-purchases"
  | "google-maps"
  | "agora"
  | "jest"
  | "detox"
  | "expo"
  | "ci-cd"
  | "linkedin"
  | "github"
  | "email"
  | "android"
  | "ios";

const TECH_ICONS: Record<TechKey, IconType> = {
  react: SiReact,
  "react-native": SiReact,
  typescript: SiTypescript,
  javascript: SiJavascript,
  redux: SiRedux,
  "redux-toolkit": SiRedux,
  "rest-apis": SiOpenapiinitiative,
  graphql: SiGraphql,
  firebase: SiFirebase,
  "push-notifications": HiOutlineBell,
  "deep-linking": HiOutlineLink,
  "in-app-purchases": SiApple,
  "google-maps": SiGooglemaps,
  agora: HiOutlineVideoCamera,
  jest: SiJest,
  detox: HiOutlineBeaker,
  expo: SiExpo,
  "ci-cd": SiGithubactions,
  linkedin: FaLinkedin,
  github: SiGithub,
  email: MdOutlineEmail,
  android: SiReact,
  ios: SiApple,
};

const ALIASES: Record<string, TechKey> = {
  rn: "react-native",
  "react native": "react-native",
  ts: "typescript",
  js: "javascript",
  rtk: "redux-toolkit",
  "redux toolkit": "redux-toolkit",
  rest: "rest-apis",
  "rest api": "rest-apis",
  "rest apis": "rest-apis",
  "restful apis": "rest-apis",
  "push notifications": "push-notifications",
  "deep linking": "deep-linking",
  "in-app purchases": "in-app-purchases",
  "google maps": "google-maps",
  maps: "google-maps",
  "agora video": "agora",
  "ci/cd": "ci-cd",
  "ci-cd & git": "ci-cd",
  git: "ci-cd",
  "github actions": "ci-cd",
};

const LABELS: Partial<Record<TechKey, string>> = {
  react: "React",
  "react-native": "React Native",
  typescript: "TypeScript",
  javascript: "JavaScript",
  redux: "Redux",
  "redux-toolkit": "Redux Toolkit",
  "rest-apis": "REST APIs",
  graphql: "GraphQL",
  firebase: "Firebase",
  "push-notifications": "Push Notifications",
  "deep-linking": "Deep Linking",
  "in-app-purchases": "In-App Purchases",
  "google-maps": "Google Maps",
  agora: "Agora",
  jest: "Jest",
  detox: "Detox",
  expo: "Expo",
  "ci-cd": "CI/CD & Git",
  linkedin: "LinkedIn",
  github: "GitHub",
  email: "Email",
  android: "Android",
  ios: "iOS",
};

export function resolveTechKey(input: string): TechKey | null {
  const normalized = input.trim().toLowerCase();
  if (normalized in TECH_ICONS) return normalized as TechKey;
  if (normalized in ALIASES) return ALIASES[normalized]!;
  return null;
}

export function getTechLabel(input: string): string {
  const key = resolveTechKey(input);
  if (key && LABELS[key]) return LABELS[key]!;
  return input
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getTechIcon(input: string): IconType | null {
  const key = resolveTechKey(input);
  return key ? TECH_ICONS[key] : null;
}
