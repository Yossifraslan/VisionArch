import type { Route } from "./+types/home";
import Navbar from "../../componens/Navbar";
import Footer from "../../componens/Footer";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "About - VisionArch" }];
}

export default function About() {
  return (
    <div className="pt-20 pb-16 bg-background text-foreground min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <section className="hero">
          <div className="announce">
            <p>A more thoughtful way to plan rooms</p>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif leading-tight text-black mb-6">
            Sketch room ideas without losing the original plan.
          </h1>

          <p className="subtitle mb-8">
            VisionArch is built for the in-between part of design: rough layouts,
            room references, and little visual experiments before the final
            answer becomes obvious.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Link to="/draw" className="btn btn--primary btn--md">
              Start Planning
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <article className="card p-8">
            <h2 className="text-xl font-serif mb-3">The idea</h2>
            <p className="text-sm text-zinc-600">
              I wanted a small tool that feels like a real design notebook: fast,
              tactile, and easy to keep using when you are thinking through a
              room in the middle of the day.
            </p>
          </article>

          <article className="card p-8">
            <h2 className="text-xl font-serif mb-3">What matters</h2>
            <ul className="text-sm text-zinc-600 space-y-2">
              <li>
                <strong>Clarity:</strong> room studies that stay readable.
              </li>
              <li>
                <strong>Speed:</strong> ideas captured before they disappear.
              </li>
              <li>
                <strong>Ownership:</strong> your projects stay in your own flow.
              </li>
            </ul>
          </article>
        </section>

        <article className="card p-8 max-w-4xl mx-auto mb-12">
          <h2 className="text-xl font-serif mb-3">Why it exists</h2>
          <p className="text-sm text-zinc-600">
            Room planning is a personal process. You move between quick sketch,
            practical layout, and mood check in a single afternoon. VisionArch is
            meant to support that rhythm without turning the whole thing into a
            giant, overbuilt platform.
          </p>

          <h3 className="text-lg font-serif mt-6 mb-2">Thanks for trying VisionArch</h3>
          <p className="text-sm text-zinc-600">
            If something feels awkward or unclear, that is useful feedback. I want
            the tool to feel honest, useful, and easy to keep using.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
