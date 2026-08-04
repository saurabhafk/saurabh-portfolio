import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content border-base-300 mt-8 border-t p-10">
      <aside>
        <p className="font-display text-lg font-bold">Saurabh Srivastava</p>
        <p className="max-w-xs text-base-content/70">
          React Native engineer building high-performance Android & iOS apps —
          expanding into backend and AI-assisted products.
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Explore</h6>
        <Link href="/projects" className="link link-hover">
          Projects
        </Link>
        <Link href="/experience" className="link link-hover">
          Experience
        </Link>
        <Link href="/skills" className="link link-hover">
          Skills
        </Link>
        <Link href="/about" className="link link-hover">
          About
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Connect</h6>
        <a href="mailto:saurabhsri98@gmail.com" className="link link-hover">
          Email
        </a>
        <a
          href="https://linkedin.com/in/saurabhafk"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/saurabhafk"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          GitHub
        </a>
      </nav>
    </footer>
  );
}
