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
            <p>Introducing VisionArch</p>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif leading-tight text-black mb-6">
            Build and iterate on spaces at the speed of thought
          </h1>

          <p className="subtitle mb-8">
            VisionArch blends fast visual feedback and familiar web workflows
            with generative tooling so designers can move from idea to image
            faster.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Link to="/draw" className="btn btn--primary btn--md">
              Start Building
            </Link>
            <Link to="/visualizer" className="btn btn--outline btn--md">
              View Samples
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <article className="card p-8">
            <h2 className="text-xl font-serif mb-3">My approach</h2>
            <p className="text-sm text-zinc-600">
              I build small, focused tools that slot into existing workflows.
              VisionArch accelerates concepting and early-stage visualization
              without replacing your main design software.
            </p>
          </article>

          <article className="card p-8">
            <h2 className="text-xl font-serif mb-3">Design principles</h2>
            <ul className="text-sm text-zinc-600 space-y-2">
              <li>
                <strong>Speed:</strong> fast feedback and fluid iteration.
              </li>
              <li>
                <strong>Clarity:</strong> predictable controls and sensible
                defaults.
              </li>
              <li>
                <strong>Respect:</strong> keep your creative ownership and data
                in your control.
              </li>
            </ul>
          </article>
        </section>

        <article className="card p-8 max-w-4xl mx-auto mb-12">
          <h2 className="text-xl font-serif mb-3">About the author</h2>
          <p className="text-sm text-zinc-600">
            I'm a product designer and engineer who focuses on building
            delightful, practical tools. I ship early, learn quickly from
            users, and iterate based on real-world feedback.
          </p>

          <h3 className="text-lg font-serif mt-6 mb-2">Thanks for trying VisionArch</h3>
          <p className="text-sm text-zinc-600">
            Feedback helps - if you run into anything odd or have ideas, I pay
            attention and iterate fast.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
