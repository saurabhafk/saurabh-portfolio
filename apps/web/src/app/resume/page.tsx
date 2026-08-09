import Link from "next/link";
import { getContent } from "@/lib/content";
import { LaTeXResumeRenderer } from "@/components/resume/LaTeXResumeRenderer";
import { ResumeViewSwitcher } from "@/components/resume/ResumeViewSwitcher";

export const metadata = {
  title: "Resume — Saurabh Srivastava",
  description: "View and copy the official LaTeX resume (resume.tex) and PDF of Saurabh Srivastava.",
};

export default function ResumePage() {
  const { resumeTex } = getContent();

  const defaultTex = `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}

\\pagestyle{empty}

\\begin{document}

\\begin{center}
  {\\Huge \\textbf{Saurabh Srivastava}}\\\\[4pt]
  +91-8574131772 \\enspace|\\enspace \\href{mailto:saurabhsri98@gmail.com}{saurabhsri98@gmail.com} \\enspace|\\enspace \\href{https://linkedin.com/in/saurabhafk}{linkedin.com/in/saurabhafk} \\enspace|\\enspace \\href{https://github.com/saurabhafk}{github.com/saurabhafk}
\\end{center}

\\section*{SUMMARY}
\\hrule
\\vspace{4pt}
I'm a React Native developer with 4 years building production iOS and Android apps --- real-time systems, payments, and on-device ML included. I care most about shipping reliable, well-architected code, and I lean on AI tooling like Claude and Cursor to move faster without cutting corners.

\\section*{TECHNICAL SKILLS}
\\hrule
\\vspace{4pt}
\\begin{itemize}[leftmargin=*,noitemsep,topsep=0pt]
  \\item \\textbf{Core:} JavaScript (ES6+), TypeScript, React Native, Redux/Redux Toolkit, Context API
  \\item \\textbf{Integrations \\& APIs:} Firebase (Auth, FCM), Notifee, Stripe, Checkr, Intercom, Agora, Socket.io, Branch.io, ML Kit, RN Keychain/Keystore
  \\item \\textbf{Maps \\& Location:} Google Maps, Apple Maps, Waze, Google Places Autocomplete
  \\item \\textbf{Testing \\& Tooling:} Jest, Detox, React Native Debugger, Git, CI/CD, Expo
  \\item \\textbf{AI-Assisted Development:} ChatGPT, Claude, Claude Code, Cursor --- for rapid prototyping, debugging, and code review
  \\item \\textbf{Practices:} Agile/Scrum, performance profiling \\& optimization, cross-functional collaboration
\\end{itemize}

\\section*{EXPERIENCE}
\\hrule
\\vspace{4pt}

\\textbf{Software Engineer -- React Native} \\hfill Jul 2023 -- Present | Noida, UP\\\\
\\textit{Appinventiv Technologies}
\\begin{itemize}[leftmargin=*,noitemsep,topsep=2pt]
  \\item Led development of high-performance cross-platform apps in React Native, architecting state management with Redux and Context API for reliability at scale.
  \\item Built dynamic multi-page forms, reusable UI components, and interactive data visualizations, cutting new-feature development time across the team.
  \\item Secured authentication via device keychain token storage and Google/Apple auth; shipped in-app purchases, Google Mobile Ads, push/in-app notifications, and Branch.io deep linking.
  \\item Drove Agile ceremonies (sprint planning, code reviews, stand-ups) across the full development lifecycle.
\\end{itemize}

\\end{document}`;

  const tex = resumeTex ?? defaultTex;

  return (
    <main className="section-shell">
      <ResumeViewSwitcher latex={tex} />
    </main>
  );
}
