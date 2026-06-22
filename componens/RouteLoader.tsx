import { useEffect, useRef, useState } from "react";

const MIN_VISIBLE_MS = 1400;
const INITIAL_LOAD_MIN_MS = 1800;

const RouteLoader = ({ isActive }: { isActive: boolean }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [phase, setPhase] = useState<
    "drawing" | "opening" | "revealed" | "closing"
  >("drawing");
  const shownAtRef = useRef<number>(Date.now());
  const isInitialRef = useRef(true);

  useEffect(() => {
    // Initial mount — always show the loader once, covers full page reloads.
    const openTimer = setTimeout(() => setPhase("opening"), 700);
    const revealTimer = setTimeout(() => setPhase("revealed"), 1000);
    const closeTimer = setTimeout(() => {
      setPhase("closing");
      setTimeout(() => {
        setShouldRender(false);
        isInitialRef.current = false;
      }, 350);
    }, INITIAL_LOAD_MIN_MS);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(revealTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  useEffect(() => {
    if (isInitialRef.current) return;

    if (isActive) {
      setShouldRender(true);
      setPhase("drawing");
      shownAtRef.current = Date.now();

      const openTimer = setTimeout(() => setPhase("opening"), 700);
      const revealTimer = setTimeout(() => setPhase("revealed"), 1000);

      return () => {
        clearTimeout(openTimer);
        clearTimeout(revealTimer);
      };
    } else if (shouldRender) {
      const elapsed = Date.now() - shownAtRef.current;
      const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);

      const closeTimer = setTimeout(() => {
        setPhase("closing");
        setTimeout(() => setShouldRender(false), 350);
      }, remaining);

      return () => clearTimeout(closeTimer);
    }
  }, [isActive]);

  if (!shouldRender) return null;

  return (
    <div className={`route-loader ${phase === "closing" ? "is-closing" : ""}`}>
      <div className="route-loader-inner">
        <svg
          className={`route-loader-svg phase-${phase}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="box-stroke box-body"
            d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="box-stroke box-seam"
            d="M12 22.08V12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="box-stroke box-lid"
            d="m3.3 7 8.7 5 8.7-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span
          className={`route-loader-text ${phase === "revealed" || phase === "closing" ? "is-visible" : ""}`}
        >
          VISIONARCH
        </span>
      </div>
    </div>
  );
};

export default RouteLoader;
