import Link from "next/link";
import { VscDownload, VscCloudDownload, VscBriefcase, VscCheck, VscCode, VscMortarBoard, VscPerson, VscRocket } from "react-icons/vsc";
import { TechBadge } from "@/components/icons/TechBadge";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = {
  title: "Resume — Saurabh Srivastava",
  description: "Download and view the official resume of Saurabh Srivastava, React Native Engineer with 4 years of experience.",
};

export default function ResumePage() {
  return (
    <main className="section-shell">
      {/* Header bar */}
      <Reveal>
        <div className="vscode-panel rounded-box mb-8 overflow-hidden">
          <div className="border-base-300 bg-base-300/40 flex flex-wrap items-center justify-between gap-4 border-b px-4 py-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="code-token-keyword">file</span>
              <span className="text-base-content/70">resume.pdf</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/Saurabh_Srivastava_Resume.pdf"
                download="Saurabh_Srivastava_Resume.pdf"
                className="btn btn-primary btn-sm gap-2 font-sans text-xs px-4"
              >
                <VscDownload className="h-4 w-4" />
                Download PDF Resume
              </a>
              <a
                href="/Saurabh_Srivastava_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm gap-2 font-mono text-xs px-3"
              >
                <VscCloudDownload className="h-4 w-4" />
                Open PDF
              </a>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold md:text-4xl">
                  Saurabh Srivastava
                </h1>
                <p className="mt-1 text-lg text-primary font-medium">
                  React Native Engineer &bull; 4 Years Experience
                </p>
              </div>
              <div className="font-mono text-xs text-base-content/70 space-y-1">
                <div>📞 +91-8574131772</div>
                <div>✉️ saurabhsri98@gmail.com</div>
                <div>
                  🔗{" "}
                  <a
                    href="https://linkedin.com/in/saurabhafk"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-primary"
                  >
                    linkedin.com/in/saurabhafk
                  </a>
                </div>
                <div>
                  💻{" "}
                  <a
                    href="https://github.com/saurabhafk"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-primary"
                  >
                    github.com/saurabhafk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* PDF Embedded Viewer */}
      <Reveal delay={0.05}>
        <div className="vscode-panel rounded-box mb-12 overflow-hidden">
          <div className="border-base-300 bg-base-300/40 px-4 py-2 font-mono text-xs flex items-center justify-between border-b">
            <span className="code-token-comment">{"// PDF Document Viewer"}</span>
            <a
              href="/Saurabh_Srivastava_Resume.pdf"
              download="Saurabh_Srivastava_Resume.pdf"
              className="link link-primary font-mono text-xs"
            >
              Direct Download ↓
            </a>
          </div>
          <div className="w-full bg-base-100 p-2">
            <object
              data="/Saurabh_Srivastava_Resume.pdf"
              type="application/pdf"
              className="h-[650px] w-full rounded border border-base-300"
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

      {/* Web Styled Resume Content */}
      <div className="space-y-10">
        {/* SUMMARY */}
        <Reveal delay={0.1}>
          <section className="vscode-panel rounded-box p-6 md:p-8">
            <div className="mb-4 flex items-center gap-2 border-b border-base-300 pb-3">
              <VscPerson className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold uppercase tracking-wide">
                Summary
              </h2>
            </div>
            <p className="text-base leading-relaxed text-base-content/85">
              I’m a React Native developer with 4 years building production iOS and Android apps — real-time systems, payments, and on-device ML included. I care most about shipping reliable, well-architected code, and I lean on AI tooling like Claude and Cursor to move faster without cutting corners.
            </p>
          </section>
        </Reveal>

        {/* TECHNICAL SKILLS */}
        <Reveal delay={0.15}>
          <section className="vscode-panel rounded-box p-6 md:p-8">
            <div className="mb-6 flex items-center gap-2 border-b border-base-300 pb-3">
              <VscCode className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold uppercase tracking-wide">
                Technical Skills
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <div className="font-mono text-xs text-base-content/50 uppercase tracking-wider">
                  Core
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <TechBadge name="javascript" size="sm" />
                  <TechBadge name="typescript" size="sm" />
                  <TechBadge name="react-native" size="sm" className="badge-primary badge-outline" />
                  <TechBadge name="redux-toolkit" size="sm" />
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">Context API</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-mono text-xs text-base-content/50 uppercase tracking-wider">
                  Integrations & APIs
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <TechBadge name="firebase" size="sm" />
                  <TechBadge name="stripe" size="sm" />
                  <TechBadge name="socket-io" size="sm" />
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">Notifee</span>
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">Checkr</span>
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">Intercom</span>
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">Agora</span>
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">Branch.io</span>
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">ML Kit</span>
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">RN Keychain</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-mono text-xs text-base-content/50 uppercase tracking-wider">
                  Maps & Location
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <TechBadge name="google-maps" size="sm" />
                  <TechBadge name="apple-maps" size="sm" />
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">Waze</span>
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">Places Autocomplete</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-mono text-xs text-base-content/50 uppercase tracking-wider">
                  Testing, AI & Tooling
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <TechBadge name="jest" size="sm" />
                  <TechBadge name="expo" size="sm" />
                  <TechBadge name="git" size="sm" />
                  <TechBadge name="claude-code" size="sm" />
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">Detox</span>
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">ChatGPT</span>
                  <span className="badge badge-ghost font-mono text-xs px-3 py-1">Cursor</span>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* EXPERIENCE */}
        <Reveal delay={0.2}>
          <section className="vscode-panel rounded-box p-6 md:p-8">
            <div className="mb-6 flex items-center gap-2 border-b border-base-300 pb-3">
              <VscBriefcase className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold uppercase tracking-wide">
                Experience
              </h2>
            </div>

            <div className="space-y-8">
              {/* Role 1 */}
              <div>
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <h3 className="font-display text-lg font-bold">
                    Software Engineer – React Native
                  </h3>
                  <span className="font-mono text-xs text-primary">
                    Jul 2023 – Present | Noida, UP
                  </span>
                </div>
                <div className="text-sm font-semibold text-secondary mb-3">
                  Appinventiv Technologies
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
                  <li>Led development of high-performance cross-platform apps in React Native, architecting state management with Redux and Context API for reliability at scale.</li>
                  <li>Built dynamic multi-page forms, reusable UI components, and interactive data visualizations, cutting new-feature development time across the team.</li>
                  <li>Secured authentication via device keychain token storage and Google/Apple auth; shipped in-app purchases, Google Mobile Ads, push/in-app notifications, and Branch.io deep linking.</li>
                  <li>Drove Agile ceremonies (sprint planning, code reviews, stand-ups) across the full development lifecycle.</li>
                </ul>
              </div>

              {/* Role 2 */}
              <div className="border-t border-base-300/60 pt-6">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <h3 className="font-display text-lg font-bold">
                    Jr. Software Engineer
                  </h3>
                  <span className="font-mono text-xs text-primary">
                    Jun 2022 – Jun 2023 | Delhi, India
                  </span>
                </div>
                <div className="text-sm font-semibold text-secondary mb-3">
                  Service Ninjas Pvt. Ltd.
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
                  <li>Built cross-platform apps using JavaScript, React Native, and Redux; debugged and optimized components for performance.</li>
                  <li>Partnered with senior developers to implement UI features and integrate RESTful APIs.</li>
                </ul>
              </div>

              {/* Role 3 */}
              <div className="border-t border-base-300/60 pt-6">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <h3 className="font-display text-lg font-bold">
                    Analyst
                  </h3>
                  <span className="font-mono text-xs text-primary">
                    Aug 2021 – May 2022 | Pune, MH
                  </span>
                </div>
                <div className="text-sm font-semibold text-secondary mb-3">
                  Capgemini
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
                  <li>Trained in Java, JavaScript, HTML/CSS, and Salesforce; earned multiple Salesforce skill badges building declarative automations (Flow, Process Builder).</li>
                </ul>
              </div>
            </div>
          </section>
        </Reveal>

        {/* PROJECTS */}
        <Reveal delay={0.25}>
          <section className="vscode-panel rounded-box p-6 md:p-8">
            <div className="mb-6 flex items-center gap-2 border-b border-base-300 pb-3">
              <VscRocket className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold uppercase tracking-wide">
                Featured Projects
              </h2>
            </div>

            <div className="space-y-8">
              {/* Project 1 */}
              <div>
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <h3 className="font-display text-lg font-bold flex items-center gap-2">
                    Ponteo
                    <span className="font-mono text-xs text-base-content/50 font-normal">
                      · US-based dental marketplace app
                    </span>
                  </h3>
                  <span className="font-mono text-xs text-primary">10 Months</span>
                </div>
                <div className="text-xs font-mono text-secondary mb-3">
                  Firebase, Stripe, ML Kit, Socket.io
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
                  <li>Built phone-number-based login alongside Firebase Google/Apple sign-in and React Native Keychain/Keystore for secure token storage; added biometric auth (Face ID/Touch ID), cutting login time 50% (4s manual entry to 2s) while removing password entry as an attack surface.</li>
                  <li>Integrated Stripe for in-app payments and Checkr for automated background verification of dental professionals.</li>
                  <li>Replaced manual pull-to-refresh with on-device caching and Socket.io live sync, pushing data updates to the UI instantly as they occurred; added real-time chat via Agora and Intercom support.</li>
                  <li>Integrated Google/Apple Maps, Waze, and Places Autocomplete for navigation, plus on-device ML Kit for automatic profile picture background removal.</li>
                </ul>
              </div>

              {/* Project 2 */}
              <div className="border-t border-base-300/60 pt-6">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <h3 className="font-display text-lg font-bold">
                    Yeether App
                  </h3>
                  <span className="font-mono text-xs text-primary">Ongoing</span>
                </div>
                <div className="text-xs font-mono text-secondary mb-3">
                  Push Notifications, Google AdMob, IAP
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
                  <li>Built secure Google/Apple sign-in with RN Keychain token storage; integrated Google Mobile Ads and in-app purchases to expand monetization.</li>
                </ul>
              </div>

              {/* Project 3 */}
              <div className="border-t border-base-300/60 pt-6">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <h3 className="font-display text-lg font-bold">
                    Loginext Dispatcher
                  </h3>
                  <span className="font-mono text-xs text-primary">6 Months</span>
                </div>
                <div className="text-xs font-mono text-secondary mb-3">
                  Redux, Data Viz, Google Maps
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
                  <li>Built multi-page forms, bar/pie/donut chart visualizations, and Google Maps clustering for analytics-driven dispatch decisions.</li>
                </ul>
              </div>

              {/* Project 4 */}
              <div className="border-t border-base-300/60 pt-6">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <h3 className="font-display text-lg font-bold">
                    Rainbow Hospitals
                  </h3>
                  <span className="font-mono text-xs text-primary">4 Months</span>
                </div>
                <div className="text-xs font-mono text-secondary mb-3">
                  Custom Chat, Video, Scheduling
                </div>
                <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
                  <li>Built in-person/virtual consultation scheduling with Agora video consultations and a period-tracking feature for preventive women’s healthcare.</li>
                </ul>
              </div>
            </div>
          </section>
        </Reveal>

        {/* EDUCATION & CERTIFICATIONS */}
        <Reveal delay={0.3}>
          <div className="grid gap-6 md:grid-cols-2">
            <section className="vscode-panel rounded-box p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-base-300 pb-3">
                <VscMortarBoard className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-bold uppercase tracking-wide">
                  Education
                </h2>
              </div>
              <h3 className="font-display font-semibold text-base">
                B.Tech, Information Technology
              </h3>
              <p className="text-sm text-secondary">
                Noida Institute of Engineering & Technology
              </p>
              <p className="font-mono text-xs text-base-content/50 mt-1">
                2017 – 2021
              </p>
            </section>

            <section className="vscode-panel rounded-box p-6">
              <div className="mb-4 flex items-center gap-2 border-b border-base-300 pb-3">
                <VscCheck className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-bold uppercase tracking-wide">
                  Certifications
                </h2>
              </div>
              <h3 className="font-display font-semibold text-base">
                Anthropic AI Development Coursework
              </h3>
              <p className="text-sm text-secondary">
                Claude / AI Tooling
              </p>
              <p className="font-mono text-xs text-base-content/50 mt-1">
                2026
              </p>
            </section>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
