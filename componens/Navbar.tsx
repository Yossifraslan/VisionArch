import { Box, Moon, Sun } from "lucide-react";
import Button from "./ui/Button";
import { useOutletContext } from "react-router";
import { Link } from "react-router";

const Navbar = () => {
  const { isSignedIn, userName, signIn, signOut, isDark, toggleDark } =
    useOutletContext<AuthContext>();

  const handleAuthClick = () => {
    if (isSignedIn) {
      void signOut().catch((e) => {
        console.error(`Puter sign out failed: ${e}`);
      });
      return;
    }

    void signIn().catch((e) => {
      console.error(`Puter sign in failed: ${e}`);
    });
  };

  return (
    <header className="navbar">
      <nav className="inner items-center">
        <div className="left">
          <Link to="/" className="brand">
            <Box className="logo" />
            <span className="name">VisionArch</span>
          </Link>
        </div>

        <div className="links md:flex md:items-center md:gap-6">
          {isSignedIn && <Link to="/draw">Draw</Link>}
          <Link to="/community">Ideas from the community</Link>
        </div>

        <div className="actions">
          <button
            type="button"
            className="dark-mode-toggle"
            onClick={toggleDark}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isSignedIn ? (
            <>
              <span className="greeting">
                {userName ? `Hello, ${userName}` : "Your workspace"}
              </span>

              <Button size="sm" onClick={handleAuthClick} className="btn">
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAuthClick} size="sm" variant="ghost">
                Sign in
              </Button>

              <button className="cta" onClick={handleAuthClick}>
                Let’s begin
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
