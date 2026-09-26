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
    <div className="privacy-page min-h-screen flex flex-col justify-between bg-background text-foreground">
      <Navbar />

      <main className="grow max-w-5xl w-full mx-auto px-6 pt-28 pb-12">
        {/* Header */}
        <section className="bg-white dark:bg-surface rounded-xl p-8 shadow-lg border border-zinc-100 dark:border-zinc-700 mb-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-serif mb-2 text-black dark:text-white">
                Privacy & Data
              </h1>

              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Effective date: {effectiveDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="btn btn--ghost btn--sm text-black dark:text-white"
              >
                Back Home
              </Link>

              <a
                href="mailto:raslanyossif@gmail.com?subject=VisionArch%20Support"
                className="btn btn--primary btn--sm rounded-lg"
              >
                Contact
              </a>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full mb-12">
          <div className="bg-white dark:bg-surface rounded-xl p-6 border border-zinc-100 dark:border-zinc-700 shadow-sm">
            <h3 className="text-lg font-serif mb-2 text-black dark:text-white">
              What I collect
            </h3>

            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              I collect minimal information required to run the service: account
              identifiers, project metadata, and uploaded files. Sensitive data
              is only collected if you explicitly provide it.
            </p>
          </div>

          <div className="bg-white dark:bg-surface rounded-xl p-6 border border-zinc-100 dark:border-zinc-700 shadow-sm">
            <h3 className="text-lg font-serif mb-2 text-black dark:text-white">
              How I use data
            </h3>

            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Project data is used to render and persist your projects.
              Anonymized usage metrics may be used to improve the product and
              diagnose issues.
            </p>
          </div>
          <div className="col-span-full bg-white dark:bg-surface rounded-xl p-6 border border-zinc-100 dark:border-zinc-700 shadow-sm">
          <h3 className="text-lg font-serif mb-3 text-black dark:text-white">
            Third parties
          </h3>

          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            I rely on a small set of third-party services (auth, analytics,
            hosting). Each provider follows its own policies. I do not sell
            personal data.
          </p>
          </div>

          <div className="col-span-full bg-white dark:bg-surface rounded-xl p-6 border border-zinc-100 dark:border-zinc-700 shadow-sm">
          <h3 className="text-lg font-serif mb-3 text-black dark:text-white">
            Cookies & local storage
          </h3>

          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Cookies are used for session/auth and preferences. You can clear
            these via your browser settings at any time.
          </p>
          </div>
        </div>

        {/* Contact */}
        <section id="contact" className="text-center">
          <h3 className="text-xl font-serif mb-3 text-black dark:text-white">
            Questions?
          </h3>

          <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">
            Email: <a href="mailto:raslanyossif@gmail.com?subject=VisionArch%20Support" className="text-primary underline underline-offset-4">raslanyossif@gmail.com</a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
