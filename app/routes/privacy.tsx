import type { Route } from "./+types/home";
import Navbar from "../../componens/Navbar";
import Footer from "../../componens/Footer";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Privacy — VisionArch" }];
}

export default function Privacy() {
  const effectiveDate = "2026-08-12";

  return (
    <div className="pt-20 pb-16 bg-background text-foreground min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 mt-12">
        <section className="bg-white rounded-xl p-8 shadow-lg border border-zinc-100 mb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-serif mb-2">Privacy & Data</h1>
              <p className="text-sm text-zinc-500">Effective date: {effectiveDate}</p>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/" className="btn btn--ghost btn--sm">
                Back Home
              </Link>
              <a href="#contact" className="btn btn--primary btn--sm">
                Contact
              </a>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="card p-6">
            <h3 className="text-lg font-serif mb-2">What I collect</h3>
            <p className="text-sm text-zinc-600">
              I collect minimal information required to run the service: account identifiers,
              project metadata, and uploaded files. Sensitive data is only collected if you
              explicitly provide it.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-serif mb-2">How I use data</h3>
            <p className="text-sm text-zinc-600">
              Project data is used to render and persist your projects. Anonymized usage
              metrics may be used to improve the product and diagnose issues.
            </p>
          </div>
        </section>

        <section className="card p-6 mb-8">
          <h3 className="text-lg font-serif mb-3">Third parties</h3>
          <p className="text-sm text-zinc-600">
            I rely on a small set of third-party services (auth, analytics, hosting).
            Each provider follows its own policies. I do not sell personal data.
          </p>
        </section>

        <section className="card p-6 mb-12">
          <h3 className="text-lg font-serif mb-3">Cookies & local storage</h3>
          <p className="text-sm text-zinc-600">
            Cookies are used for session/auth and preferences. You can clear these via
            your browser settings at any time.
          </p>
        </section>

        <section id="contact" className="text-center">
          <h3 className="text-xl font-serif mb-3">Questions?</h3>
          <p className="text-sm text-zinc-600 mb-4">Email: hello@visionarch.example (demo)</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
