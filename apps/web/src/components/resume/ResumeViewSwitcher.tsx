"use client";

import { useState } from "react";
import { VscCode, VscEye, VscFilePdf, VscDownload, VscCopy, VscCheck } from "react-icons/vsc";
import { LaTeXResumeRenderer } from "./LaTeXResumeRenderer";
import { Reveal } from "@/components/motion/Reveal";

export function ResumeViewSwitcher({ latex }: { latex: string }) {
  const [activeTab, setActiveTab] = useState<"visual" | "latex" | "pdf">("visual");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* View Switcher Header Bar */}
      <Reveal>
        <div className="vscode-panel rounded-box overflow-hidden">
          <div className="border-base-300 bg-base-300/40 flex flex-wrap items-center justify-between gap-4 border-b px-4 py-3 font-mono text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setActiveTab("visual")}
                className={`btn btn-xs gap-1.5 font-mono ${
                  activeTab === "visual" ? "btn-primary" : "btn-ghost text-base-content/70"
                }`}
              >
                <VscEye className="h-3.5 w-3.5" />
                Rendered Web View
              </button>
              <button
                onClick={() => setActiveTab("latex")}
                className={`btn btn-xs gap-1.5 font-mono ${
                  activeTab === "latex" ? "btn-primary" : "btn-ghost text-base-content/70"
                }`}
              >
                <VscCode className="h-3.5 w-3.5" />
                LaTeX Source (resume.tex)
              </button>
              <button
                onClick={() => setActiveTab("pdf")}
                className={`btn btn-xs gap-1.5 font-mono ${
                  activeTab === "pdf" ? "btn-primary" : "btn-ghost text-base-content/70"
                }`}
              >
                <VscFilePdf className="h-3.5 w-3.5" />
                PDF Document
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeTab === "latex" && (
                <button
                  onClick={handleCopy}
                  className="btn btn-xs btn-outline gap-1.5 font-mono px-3"
                >
                  {copied ? (
                    <>
                      <VscCheck className="h-3.5 w-3.5 text-success" />
                      Copied LaTeX!
                    </>
                  ) : (
                    <>
                      <VscCopy className="h-3.5 w-3.5" />
                      Copy LaTeX
                    </>
                  )}
                </button>
              )}
              <a
                href="/Saurabh_Srivastava_Resume.pdf"
                download="Saurabh_Srivastava_Resume.pdf"
                className="btn btn-primary btn-xs gap-1.5 font-sans px-3"
              >
                <VscDownload className="h-3.5 w-3.5" />
                Download PDF
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Main Tab Content */}
      {activeTab === "visual" && (
        <Reveal delay={0.05}>
          <LaTeXResumeRenderer latex={latex} />
        </Reveal>
      )}

      {activeTab === "latex" && (
        <Reveal delay={0.05}>
          <div className="vscode-panel rounded-box overflow-hidden">
            <div className="border-base-300 bg-base-300/40 flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
              <span className="code-token-comment">{"// content/resume.tex"}</span>
              <button
                onClick={handleCopy}
                className="link link-primary font-mono text-xs"
              >
                {copied ? "✓ Copied" : "Copy Source"}
              </button>
            </div>
            <pre className="p-6 font-mono text-xs text-base-content/90 overflow-x-auto leading-relaxed whitespace-pre bg-base-100 selection:bg-primary/30">
              {latex}
            </pre>
          </div>
        </Reveal>
      )}

      {activeTab === "pdf" && (
        <Reveal delay={0.05}>
          <div className="vscode-panel rounded-box overflow-hidden">
            <div className="border-base-300 bg-base-300/40 flex items-center justify-between border-b px-4 py-2 font-mono text-xs">
              <span className="code-token-comment">{"// PDF Viewer"}</span>
              <a
                href="/Saurabh_Srivastava_Resume.pdf"
                download="Saurabh_Srivastava_Resume.pdf"
                className="link link-primary font-mono text-xs"
              >
                Direct Download ↓
              </a>
            </div>
            <div className="p-2 bg-base-100">
              <object
                data="/Saurabh_Srivastava_Resume.pdf"
                type="application/pdf"
                className="h-[750px] w-full rounded border border-base-300"
              >
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <p className="mb-4 text-base-content/70">
                    Your browser does not support embedded PDF viewing.
                  </p>
                  <a
                    href="/Saurabh_Srivastava_Resume.pdf"
                    download="Saurabh_Srivastava_Resume.pdf"
                    className="btn btn-primary gap-2"
                  >
                    <VscDownload className="h-4 w-4" /> Download Resume PDF
                  </a>
                </div>
              </object>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
