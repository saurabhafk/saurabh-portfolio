"use client";

import { VscDownload, VscCloudDownload, VscFilePdf } from "react-icons/vsc";
import { Reveal } from "@/components/motion/Reveal";

export function ResumeDocumentViewer() {
  return (
    <div className="space-y-6">
      {/* Action Header Bar */}
      <Reveal>
        <div className="vscode-panel rounded-box overflow-hidden">
          <div className="border-base-300 bg-base-300/40 flex flex-wrap items-center justify-between gap-4 border-b px-4 py-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <VscFilePdf className="h-4 w-4 text-error" />
              <span className="code-token-keyword">resume</span>
              <span className="text-base-content/80 font-semibold">Saurabh_Srivastava_Resume.pdf</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/Saurabh_Srivastava_Resume.pdf"
                download="Saurabh_Srivastava_Resume.pdf"
                className="btn btn-primary btn-sm gap-2 font-sans text-xs px-4"
              >
                <VscDownload className="h-4 w-4" />
                Download PDF
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
        </div>
      </Reveal>

      {/* Clean Web Document View (Matching PDF layout exactly) */}
      <Reveal delay={0.05}>
        <div className="vscode-panel rounded-box p-6 md:p-10 font-serif text-base-content bg-base-100 space-y-6">
          <header className="text-center border-b border-base-300 pb-4">
            <h1 className="text-3xl font-bold font-display tracking-tight md:text-4xl text-base-content">
              Saurabh Srivastava
            </h1>
            <div className="mt-2 text-xs md:text-sm font-sans text-base-content/80 flex flex-wrap items-center justify-center gap-2">
              <span>+91-8574131772</span>
              <span>•</span>
              <a href="mailto:saurabhsri98@gmail.com" className="link link-hover text-primary">saurabhsri98@gmail.com</a>
              <span>•</span>
              <a href="https://linkedin.com/in/saurabhafk" target="_blank" rel="noreferrer" className="link link-hover text-primary">linkedin.com/in/saurabhafk</a>
              <span>•</span>
              <a href="https://github.com/saurabhafk" target="_blank" rel="noreferrer" className="link link-hover text-primary">github.com/saurabhafk</a>
            </div>
          </header>

          {/* SUMMARY */}
          <section>
            <h2 className="text-sm font-bold tracking-widest uppercase border-b border-base-content/40 pb-1 mb-2 font-display">
              SUMMARY
            </h2>
            <p className="text-sm leading-relaxed text-base-content/90 font-sans">
              I’m a React Native developer with 4 years building production iOS and Android apps — real-time systems, payments, and on-device ML included. I care most about shipping reliable, well-architected code, and I lean on AI tooling like Claude and Cursor to move faster without cutting corners.
            </p>
          </section>

          {/* TECHNICAL SKILLS */}
          <section>
            <h2 className="text-sm font-bold tracking-widest uppercase border-b border-base-content/40 pb-1 mb-2 font-display">
              TECHNICAL SKILLS
            </h2>
            <ul className="text-sm space-y-1.5 font-sans leading-relaxed text-base-content/90">
              <li><strong>Core:</strong> JavaScript (ES6+), TypeScript, React Native, Redux/Redux Toolkit, Context API</li>
              <li><strong>Integrations & APIs:</strong> Firebase (Auth, FCM), Notifee, Stripe, Checkr, Intercom, Agora, Socket.io, Branch.io, ML Kit, RN Keychain/Keystore</li>
              <li><strong>Maps & Location:</strong> Google Maps, Apple Maps, Waze, Google Places Autocomplete</li>
              <li><strong>Testing & Tooling:</strong> Jest, Detox, React Native Debugger, Git, CI/CD, Expo</li>
              <li><strong>AI-Assisted Development:</strong> ChatGPT, Claude, Claude Code, Cursor — for rapid prototyping, debugging, and code review</li>
              <li><strong>Practices:</strong> Agile/Scrum, performance profiling & optimization, cross-functional collaboration</li>
            </ul>
          </section>

          {/* EXPERIENCE */}
          <section>
            <h2 className="text-sm font-bold tracking-widest uppercase border-b border-base-content/40 pb-1 mb-3 font-display">
              EXPERIENCE
            </h2>
            <div className="space-y-4 font-sans text-sm">
              <div>
                <div className="flex justify-between items-baseline font-medium">
                  <div><strong>Software Engineer – React Native</strong> — <em>Appinventiv Technologies</em></div>
                  <div className="text-xs text-base-content/70 italic">Jul 2023 – Present | Noida, UP</div>
                </div>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs md:text-sm text-base-content/90">
                  <li>Led development of high-performance cross-platform apps in React Native, architecting state management with Redux and Context API for reliability at scale.</li>
                  <li>Built dynamic multi-page forms, reusable UI components, and interactive data visualizations, cutting new-feature development time across the team.</li>
                  <li>Secured authentication via device keychain token storage and Google/Apple auth; shipped in-app purchases, Google Mobile Ads, push/in-app notifications, and Branch.io deep linking.</li>
                  <li>Drove Agile ceremonies (sprint planning, code reviews, stand-ups) across the full development lifecycle.</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-baseline font-medium">
                  <div><strong>Jr. Software Engineer</strong> — <em>Service Ninjas Pvt. Ltd.</em></div>
                  <div className="text-xs text-base-content/70 italic">Jun 2022 – Jun 2023 | Delhi, India</div>
                </div>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs md:text-sm text-base-content/90">
                  <li>Built cross-platform apps using JavaScript, React Native, and Redux; debugged and optimized components for performance.</li>
                  <li>Partnered with senior developers to implement UI features and integrate RESTful APIs.</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-baseline font-medium">
                  <div><strong>Analyst</strong> — <em>Capgemini</em></div>
                  <div className="text-xs text-base-content/70 italic">Aug 2021 – May 2022 | Pune, MH</div>
                </div>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs md:text-sm text-base-content/90">
                  <li>Trained in Java, JavaScript, HTML/CSS, and Salesforce; earned multiple Salesforce skill badges building declarative automations (Flow, Process Builder).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* PROJECTS */}
          <section>
            <h2 className="text-sm font-bold tracking-widest uppercase border-b border-base-content/40 pb-1 mb-3 font-display">
              PROJECTS
            </h2>
            <div className="space-y-4 font-sans text-sm">
              <div>
                <div className="flex justify-between items-baseline font-medium">
                  <div><strong>Ponteo</strong> | <em>US-based dental marketplace app / Firebase, Stripe, ML Kit, Socket.io</em></div>
                  <div className="text-xs text-base-content/70">10 Months</div>
                </div>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs md:text-sm text-base-content/90">
                  <li>Built phone-number-based login alongside Firebase Google/Apple sign-in and React Native Keychain/Keystore for secure token storage; added biometric auth (Face ID/Touch ID), cutting login time 50% (4s manual entry to 2s) while removing password entry as an attack surface.</li>
                  <li>Integrated Stripe for in-app payments and Checkr for automated background verification of dental professionals.</li>
                  <li>Replaced manual pull-to-refresh with on-device caching and Socket.io live sync, pushing data updates to the UI instantly as they occurred; added real-time chat via Agora and Intercom support.</li>
                  <li>Integrated Google/Apple Maps, Waze, and Places Autocomplete for navigation, plus on-device ML Kit for automatic profile picture background removal.</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-baseline font-medium">
                  <div><strong>Yeether App</strong> | <em>Push Notifications, Google AdMob, IAP</em></div>
                  <div className="text-xs text-base-content/70">Ongoing</div>
                </div>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs md:text-sm text-base-content/90">
                  <li>Built secure Google/Apple sign-in with RN Keychain token storage; integrated Google Mobile Ads and in-app purchases to expand monetization.</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-baseline font-medium">
                  <div><strong>Loginext Dispatcher</strong> | <em>Redux, Data Viz, Google Maps</em></div>
                  <div className="text-xs text-base-content/70">6 Months</div>
                </div>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs md:text-sm text-base-content/90">
                  <li>Built multi-page forms, bar/pie/donut chart visualizations, and Google Maps clustering for analytics-driven dispatch decisions.</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-baseline font-medium">
                  <div><strong>Rainbow Hospitals</strong> | <em>Custom Chat, Video, Scheduling</em></div>
                  <div className="text-xs text-base-content/70">4 Months</div>
                </div>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs md:text-sm text-base-content/90">
                  <li>Built in-person/virtual consultation scheduling with Agora video consultations and a period-tracking feature for preventive women’s healthcare.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* EDUCATION */}
          <section>
            <h2 className="text-sm font-bold tracking-widest uppercase border-b border-base-content/40 pb-1 mb-2 font-display">
              EDUCATION
            </h2>
            <div className="flex justify-between items-baseline text-sm font-sans">
              <div><strong>B.Tech, Information Technology</strong> — <em>Noida Institute of Engineering & Technology</em></div>
              <div className="text-xs text-base-content/70">2017 – 2021</div>
            </div>
          </section>

          {/* CERTIFICATIONS */}
          <section>
            <h2 className="text-sm font-bold tracking-widest uppercase border-b border-base-content/40 pb-1 mb-2 font-display">
              CERTIFICATIONS
            </h2>
            <div className="flex justify-between items-baseline text-sm font-sans">
              <div><strong>Skilljar Coursework</strong> — <em>AI-Assisted Development (Claude/Anthropic)</em></div>
              <div className="text-xs text-base-content/70">8 courses | 2026</div>
            </div>
          </section>
        </div>
      </Reveal>
    </div>
  );
}
