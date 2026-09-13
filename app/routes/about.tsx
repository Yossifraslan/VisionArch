import type { Route } from "./+types/home";
import Navbar from "../../componens/Navbar";
import Footer from "../../componens/Footer";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "About - VisionArch" }];
}

export default function About() {
  return (
    <div className="about-page">
      <Navbar />

      <main className="about-shell">
        <section className="about-hero">
          <div className="about-eyebrow"></div>

          <h1>Sketch room ideas without losing the original plan.</h1>

          <p className="subtitle">
            VisionArch is built for the in-between part of design: rough
            layouts, room references, and little visual experiments before the
            final answer becomes obvious.
          </p>

          <div className="about-actions">
            <Link to="/draw" className="btn btn--primary btn--md">
              Start Planning
            </Link>
          </div>
        </section>

        <section className="about-grid">
          <article className="about-card">
            <h2>The idea</h2>
            <p>
              I wanted a small tool that feels like a real design notebook:
              fast, tactile, and easy to keep using when you are thinking
              through a room in the middle of the day.
            </p>
          </article>

          <article className="about-card">
            <h2>What matters</h2>
            <ul>
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

        <article className="about-card about-feature">
          <h2>Why it exists</h2>
          <p>
            Room planning is a personal process. You move between quick sketch,
            practical layout, and mood check in a single afternoon. VisionArch
            is meant to support that rhythm without turning the whole thing into
            a giant, overbuilt platform.
          </p>

          <h3>Thanks for trying VisionArch</h3>
          <p>
            If something feels awkward or unclear, that is useful feedback. I
            want the tool to feel honest, useful, and easy to keep using.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
