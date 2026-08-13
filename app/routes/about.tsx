import type { Route } from "./+types/home";
import Navbar from "../../componens/Navbar";
import Footer from "../../componens/Footer";

export function meta({}: Route.MetaArgs) {
  return [{ title: "About - VisionArch" }];
}

export default function About() {
  return (
    <div className="pt-20 pb-16 bg-background text-foreground min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 prose prose-zinc mt-12">
        <h1>
          About <strong>VisionArch</strong>
        </h1>

        <p>
          I built <strong>VisionArch</strong> as an experimental, human-centered
          design tool that combines intuitive UI with generative AI to help
          architects and designers iterate faster. I focus on <strong>fast
          visual feedback</strong>, familiar web workflows, and sensible
          defaults so your creative work stays in flow.
        </p>

        <h2>
          <strong>My approach</strong>
        </h2>
        <p>
          I make small, fast tools that complement existing design workflows.
          VisionArch is intentionally opinionated - it speeds up common tasks
          (concepting, quick renders, sharing) without replacing your main
          design apps.
        </p>

        <h2>
          <strong>About me</strong>
        </h2>
        <p>
          I'm a product designer and engineer who enjoys building delightful,
          practical tools. I ship early, iterate quickly, and learn from how
          people actually use the product.
        </p>

        <h3>
          <strong>Thanks for trying VisionArch</strong>
        </h3>
        <p>
          I'm glad you're here - I hope VisionArch helps you explore ideas and
          move faster. If something stands out (good or bad), I pay attention
          to that feedback as I keep improving the tool.
        </p>
      </main>

      <Footer />
    </div>
  );
}
