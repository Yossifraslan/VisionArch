import type { Route } from "./+types/home";
import Navbar from "../../componens/Navbar";
import Footer from "../../componens/Footer";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Privacy — VisionArch" }];
}

export default function Privacy() {
  const effectiveDate = "2026-08-12";

  return (
    <div className="pt-20 pb-16 bg-background text-foreground min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 prose prose-zinc mt-12">
        <h1>
          <strong>Privacy</strong>
        </h1>

        <p>
          <strong>Effective date:</strong> {effectiveDate}
        </p>

        <h2>
          <strong>What I collect</strong>
        </h2>
        <p>
          I collect only the information necessary to run the service: account
          identifiers, project metadata (names, timestamps), and the files you
          upload to create projects. I won't collect sensitive information
          unless you explicitly provide it.
        </p>

        <h2>
          <strong>How I use data</strong>
        </h2>
        <p>
          Uploaded files and project data are used to render and persist your
          projects. I may use anonymized usage data to improve the product,
          diagnose issues, and understand feature usage.
        </p>

        <h2>
          <strong>Third parties</strong>
        </h2>
        <p>
          I rely on a small set of third-party services (auth, analytics,
          hosting). Each provider handles data according to their own
          policies - <strong>I do not sell personal data</strong>.
        </p>

        <h2>
          <strong>Cookies and local storage</strong>
        </h2>
        <p>
          I use cookies and browser storage only for session/auth and
          preference purposes. You can clear these from your browser at any
          time.
        </p>
      </main>

      <Footer />
    </div>
  );
}
