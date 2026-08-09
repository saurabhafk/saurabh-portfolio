"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import type { ReactNode } from "react";
import {
  VscAccount,
  VscBriefcase,
  VscCode,
  VscFiles,
  VscHome,
  VscBook,
  VscFilePdf,
} from "react-icons/vsc";
import { SocialLink } from "@/components/icons/SocialLink";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const nav: { href: string; label: string; Icon: IconType }[] = [
  { href: "/", label: "Home", Icon: VscHome },
  { href: "/projects", label: "Work", Icon: VscFiles },
  { href: "/experience", label: "Exp", Icon: VscBriefcase },
  { href: "/skills", label: "Skills", Icon: VscCode },
  { href: "/writing", label: "Notes", Icon: VscBook },
  { href: "/about", label: "About", Icon: VscAccount },
  { href: "/resume", label: "Resume", Icon: VscFilePdf },
];

function tabLabel(pathname: string) {
  if (pathname === "/") return "portfolio.tsx";
  if (pathname.startsWith("/projects")) return "projects.tsx";
  if (pathname.startsWith("/experience")) return "experience.tsx";
  if (pathname.startsWith("/skills")) return "skills.ts";
  if (pathname.startsWith("/writing")) return "writing.md";
  if (pathname.startsWith("/about")) return "about.md";
  if (pathname.startsWith("/resume")) return "resume.pdf";
  return "index.tsx";
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-base-200 relative h-dvh overflow-hidden">
      {/* Fixed title bar */}
      <header className="vscode-titlebar text-base-content/80 fixed inset-x-0 top-0 z-50 flex items-center justify-between px-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-base-content/50">● ● ●</span>
          <span className="font-mono hidden sm:inline">
            saurabh-portfolio — Visual Studio Code
          </span>
          <span className="font-mono sm:hidden">saurabh-portfolio</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <SocialLink
            network="linkedin"
            href="https://linkedin.com/in/saurabhafk"
            className="btn btn-ghost btn-xs gap-1.5 font-mono"
          />
          <SocialLink
            network="github"
            href="https://github.com/saurabhafk"
            className="btn btn-ghost btn-xs btn-square"
            iconOnly
          />
        </div>
      </header>

      {/* Fixed activity bar (desktop) — icon-only, VS Code style */}
      <nav
        className="vscode-activity text-base-content/55 fixed top-9 bottom-6 left-0 z-40 hidden flex-col items-center py-1 sm:flex"
        aria-label="Primary"
      >
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className={`flex h-12 w-full items-center justify-center transition ${
                active
                  ? "text-base-content border-primary border-l-2"
                  : "hover:text-base-content border-l-2 border-transparent"
              }`}
            >
              <item.Icon className="h-[22px] w-[22px]" aria-hidden />
            </Link>
          );
        })}
      </nav>

      {/* Main column — only this scrolls */}
      <div className="flex h-full flex-col pt-9 pb-6 sm:pl-12">
        <div className="bg-base-200 shrink-0 overflow-x-auto text-xs">
          <div className="flex">
            <Link
              href={pathname.startsWith("/resume") ? "/" : pathname}
              className={`vscode-tab font-mono flex items-center gap-2 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none transition ${
                !pathname.startsWith("/resume")
                  ? "vscode-tab-active text-base-content font-medium"
                  : "text-base-content/75 hover:text-base-content"
              }`}
            >
              <span className="code-token-keyword">
                {tabLabel(pathname.startsWith("/resume") ? "/" : pathname).endsWith(".ts") ||
                tabLabel(pathname.startsWith("/resume") ? "/" : pathname).endsWith(".tsx")
                  ? "tsx"
                  : "md"}
              </span>
              {tabLabel(pathname.startsWith("/resume") ? "/" : pathname)}
            </Link>
            <Link
              href="/resume"
              className={`vscode-tab font-mono flex items-center gap-2 px-4 py-2.5 whitespace-nowrap cursor-pointer select-none transition ${
                pathname.startsWith("/resume")
                  ? "vscode-tab-active text-base-content font-medium"
                  : "text-base-content/75 hover:text-base-content"
              }`}
            >
              <span className="code-token-string">pdf</span>
              resume
            </Link>
          </div>
        </div>

        <div className="border-base-300 bg-base-200 text-base-content/75 flex shrink-0 gap-2 overflow-x-auto border-b px-2 py-1.5 text-xs sm:hidden">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded transition ${
                  active
                    ? "bg-base-100 border border-primary/40 text-base-content font-medium shadow-xs"
                    : "hover:bg-base-300/40 text-base-content/70"
                }`}
              >
                <item.Icon className="h-3.5 w-3.5" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="vscode-editor min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Fixed status bar */}
      <footer className="vscode-statusbar fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 px-3 font-mono">
        <div className="flex items-center gap-3 truncate">
          <span>⎇ main*</span>
          <span className="hidden sm:inline">0 ⚠ 0 ✖</span>
          <span className="hidden md:inline">React Native Engineer</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">TypeScript React</span>
          <span>UTF-8</span>
          <a href="mailto:saurabhsri98@gmail.com" className="hover:underline">
            Hire me
          </a>
        </div>
      </footer>
    </div>
  );
}
