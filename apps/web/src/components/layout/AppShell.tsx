"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SocialLink } from "@/components/icons/SocialLink";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const nav = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/projects", label: "Work", icon: "◫" },
  { href: "/experience", label: "Exp", icon: "⧗" },
  { href: "/skills", label: "Skills", icon: "{}" },
  { href: "/writing", label: "Notes", icon: "✎" },
  { href: "/about", label: "About", icon: "◎" },
];

function tabLabel(pathname: string) {
  if (pathname === "/") return "portfolio.tsx";
  if (pathname.startsWith("/projects")) return "projects.tsx";
  if (pathname.startsWith("/experience")) return "experience.tsx";
  if (pathname.startsWith("/skills")) return "skills.ts";
  if (pathname.startsWith("/writing")) return "writing.md";
  if (pathname.startsWith("/about")) return "about.md";
  return "index.tsx";
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-base-200 flex min-h-screen flex-col">
      <header className="vscode-titlebar text-base-content/80 flex items-center justify-between px-3 text-xs">
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

      <div className="flex min-h-0 flex-1">
        <nav
          className="vscode-activity text-base-content/70 hidden flex-col items-center gap-1 py-2 sm:flex"
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
                className={`flex h-11 w-11 flex-col items-center justify-center rounded-sm text-[10px] transition ${
                  active
                    ? "text-base-content border-l-2 border-base-content bg-base-100/40"
                    : "hover:text-base-content border-l-2 border-transparent"
                }`}
              >
                <span className="font-mono text-sm leading-none">{item.icon}</span>
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="bg-base-200 flex overflow-x-auto text-xs">
            <div className="vscode-tab-active vscode-tab font-mono text-base-content flex items-center gap-2 px-4 py-2 whitespace-nowrap">
              <span className="code-token-keyword">tsx</span>
              {tabLabel(pathname)}
            </div>
            <div className="vscode-tab text-base-content/50 font-mono flex items-center px-4 py-2 whitespace-nowrap">
              README.md
            </div>
          </div>

          <div className="border-base-300 bg-base-200 text-base-content/60 flex gap-4 overflow-x-auto border-b px-3 py-1 text-xs sm:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href))
                    ? "text-base-content font-medium"
                    : ""
                }
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="vscode-editor min-h-0 flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      <footer className="vscode-statusbar flex items-center justify-between gap-3 px-3 font-mono">
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
