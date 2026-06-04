import type { Route } from "./+types/home";
import Navbar from "../../componens/Navbar";
import { ArrowRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import Button from "../../componens/ui/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Introducing VisionArch 1.0</p>
        </div>
        <h1>Build beautiful spaces at the speed of thought with Roomify</h1>

        <p className="subtitle">
          VisionArch is an AI-first design environment that helps you visualise,
          render, and ship architecutural projects faster than ever.
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start Building <ArrowRight className="icon" />
          </a>

          <Button variant="outline" size="lg" className="demo">
            Watch Demo
          </Button>
        </div>

        <div id="upload" className="upload-shell">
          <div className="grid-overlay" />

          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>

            </div>
            <h3>Upload your floor plan</h3>
            <p>Supports JPG, PNG, formats up to 10MB</p>
          </div>
        </div>
      </section>
    </div>
  );
}
