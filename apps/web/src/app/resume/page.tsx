import { ResumeDocumentViewer } from "@/components/resume/ResumeDocumentViewer";

export const metadata = {
  title: "Resume — Saurabh Srivastava",
  description: "Official resume of Saurabh Srivastava, React Native Engineer. Download PDF and view document.",
};

export default function ResumePage() {
  return (
    <main className="section-shell">
      <ResumeDocumentViewer />
    </main>
  );
}
