import Link from "next/link";
import { OpenChatButton } from "@/components/home/OpenChatButton";

export default function Home() {
  return (
    <section className="hero">
      <p className="hero__eyebrow">Saurabh</p>
      <h1 className="hero__headline">
        React Native apps, with a backend/AI path
      </h1>
      <p className="hero__lede">
        I ship mobile experiences end-to-end — from offline-first RN clients to
        Node APIs — and I&apos;m growing deeper into AI-assisted products.
      </p>
      <div className="hero__actions">
        <Link href="/projects" className="btn btn--primary">
          View projects
        </Link>
        <OpenChatButton />
      </div>
    </section>
  );
}
