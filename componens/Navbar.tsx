import { Box, Moon, Sun } from "lucide-react";
import Button from "./ui/Button";
import { useOutletContext } from "react-router";
import { Link } from "react-router";

const Navbar = () => {
  const { isSignedIn, userName, signIn, signOut, isDark, toggleDark } =
    useOutletContext<AuthContext>();

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOut();
      } catch (e) {
        console.error(`Puter sign out failed: ${e}`);
      }
      return;
    }

    try {
      await signIn();
    } catch (e) {
      console.error(`Puter sign in failed: ${e}`);
    }
  };

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <Link to="/" className="brand">
            <Box className="logo" />
            <span className="name">VisionArch</span>
          </Link>

          <div className="links">
            <Link to="/draw">Draw</Link>
            <Link to="/community">Community</Link>
          </div>
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
                {userName ? `Hi, ${userName}` : "Signed in"}
              </span>

              <Button size="sm" onClick={handleAuthClick} className="btn">
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAuthClick} size="sm" variant="ghost">
                Log In
              </Button>

              <button className="cta" onClick={handleAuthClick}>
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
