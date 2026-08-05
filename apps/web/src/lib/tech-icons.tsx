import type { IconType } from "react-icons";
import {
  SiAnthropic,
  SiApple,
  SiExpo,
  SiFirebase,
  SiGithub,
  SiGithubactions,
  SiGooglemaps,
  SiGraphql,
  SiIntercom,
  SiJavascript,
  SiJest,
  SiNodedotjs,
  SiOpenapiinitiative,
  SiPython,
  SiReact,
  SiRedux,
  SiSocketdotio,
  SiStripe,
  SiTypescript,
} from "react-icons/si";
import { FaLinkedin, FaSalesforce } from "react-icons/fa6";
import {
  HiOutlineBell,
  HiOutlineBeaker,
  HiOutlineCpuChip,
  HiOutlineFingerPrint,
  HiOutlineLink,
  HiOutlineLockClosed,
  HiOutlineSparkles,
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
  | "context-api"
  | "rest-apis"
  | "graphql"
  | "firebase"
  | "stripe"
  | "socket-io"
  | "push-notifications"
  | "deep-linking"
  | "in-app-purchases"
  | "biometric-auth"
  | "keychain"
  | "google-maps"
  | "apple-maps"
  | "ml-kit"
  | "agora"
  | "intercom"
  | "ai-assisted"
  | "claude-code"
  | "nodejs"
  | "python"
  | "salesforce"
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
  "context-api": SiReact,
  "rest-apis": SiOpenapiinitiative,
  graphql: SiGraphql,
  firebase: SiFirebase,
  stripe: SiStripe,
  "socket-io": SiSocketdotio,
  "push-notifications": HiOutlineBell,
  "deep-linking": HiOutlineLink,
  "in-app-purchases": SiApple,
  "biometric-auth": HiOutlineFingerPrint,
  keychain: HiOutlineLockClosed,
  "google-maps": SiGooglemaps,
  "apple-maps": SiApple,
  "ml-kit": HiOutlineSparkles,
  agora: HiOutlineVideoCamera,
  intercom: SiIntercom,
  "ai-assisted": HiOutlineCpuChip,
  "claude-code": SiAnthropic,
  nodejs: SiNodedotjs,
  python: SiPython,
  salesforce: FaSalesforce,
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

/** Official / commonly recognized brand colors */
const TECH_COLORS: Partial<Record<TechKey, string>> = {
  react: "#61DAFB",
  "react-native": "#61DAFB",
  typescript: "#3178C6",
  javascript: "#F7DF1E",
  redux: "#764ABC",
  "redux-toolkit": "#764ABC",
  "context-api": "#61DAFB",
  "rest-apis": "#6BA539",
  graphql: "#E10098",
  firebase: "#FFCA28",
  stripe: "#635BFF",
  "socket-io": "#010101",
  "push-notifications": "#FF6B35",
  "deep-linking": "#007ACC",
  "in-app-purchases": "#A2AAAD",
  "biometric-auth": "#34C759",
  keychain: "#007AFF",
  "google-maps": "#4285F4",
  "apple-maps": "#000000",
  "ml-kit": "#4285F4",
  agora: "#099DFD",
  intercom: "#6AF126",
  "ai-assisted": "#D97757",
  "claude-code": "#D97757",
  nodejs: "#5FA04E",
  python: "#3776AB",
  salesforce: "#00A1E0",
  jest: "#C21325",
  detox: "#7C4DFF",
  expo: "#000020",
  "ci-cd": "#2088FF",
  linkedin: "#0A66C2",
  github: "#181717",
  email: "#EA4335",
  android: "#3DDC84",
  ios: "#000000",
};

const ALIASES: Record<string, TechKey> = {
  rn: "react-native",
  "react native": "react-native",
  ts: "typescript",
  js: "javascript",
  rtk: "redux-toolkit",
  "redux toolkit": "redux-toolkit",
  context: "context-api",
  "context api": "context-api",
  rest: "rest-apis",
  "rest api": "rest-apis",
  "rest apis": "rest-apis",
  "restful apis": "rest-apis",
  "socket.io": "socket-io",
  socketio: "socket-io",
  "push notifications": "push-notifications",
  "deep linking": "deep-linking",
  branch: "deep-linking",
  "branch.io": "deep-linking",
  "in-app purchases": "in-app-purchases",
  biometric: "biometric-auth",
  "biometric auth": "biometric-auth",
  "face id": "biometric-auth",
  "touch id": "biometric-auth",
  "rn keychain": "keychain",
  keystore: "keychain",
  "google maps": "google-maps",
  maps: "google-maps",
  "apple maps": "apple-maps",
  waze: "apple-maps",
  "ml kit": "ml-kit",
  mlkit: "ml-kit",
  "agora video": "agora",
  "ai assisted": "ai-assisted",
  "ai-assisted development": "ai-assisted",
  claude: "claude-code",
  "claude code": "claude-code",
  anthropic: "claude-code",
  subagents: "claude-code",
  cursor: "ai-assisted",
  chatgpt: "ai-assisted",
  "node.js": "nodejs",
  node: "nodejs",
  salesforce: "salesforce",
  sfdc: "salesforce",
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
  "context-api": "Context API",
  "rest-apis": "REST APIs",
  graphql: "GraphQL",
  firebase: "Firebase",
  stripe: "Stripe",
  "socket-io": "Socket.io",
  "push-notifications": "Push Notifications",
  "deep-linking": "Deep Linking",
  "in-app-purchases": "In-App Purchases",
  "biometric-auth": "Biometric Auth",
  keychain: "RN Keychain / Keystore",
  "google-maps": "Google Maps",
  "apple-maps": "Apple Maps",
  "ml-kit": "ML Kit",
  agora: "Agora",
  intercom: "Intercom",
  "ai-assisted": "AI-Assisted Dev",
  "claude-code": "Claude Code",
  nodejs: "Node.js",
  python: "Python",
  salesforce: "Salesforce",
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

export function getTechColor(input: string): string | undefined {
  const key = resolveTechKey(input);
  return key ? TECH_COLORS[key] : undefined;
}
