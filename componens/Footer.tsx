import { useId } from "react";

export default function Footer() {
  const id = useId();
  const year = new Date().getFullYear();

  return (
    <footer className="footer mt-12 border-t border-black/5 bg-background/50">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
        <div className="flex items-center space-x-3">
          <span className="text-zinc-900 font-semibold">VisionArch</span>
          <span className="hidden sm:inline">
            - experiments in composition &amp; tools
          </span>
        </div>

        <nav
          aria-label={`footer-${id}`}
          className="flex items-center space-x-4"
        >
          <a className="hover:underline" href="/about">
            About
          </a>
          <a className="hover:underline" href="/privacy">
            Privacy
          </a>
        </nav>

        <div className="text-zinc-500 text-xs">
          <span>
            Made <span aria-hidden></span> by Yossif Raslan • {year}
          </span>
        </div>
      </div>
    </footer>
  );
}
