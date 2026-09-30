import type { Route } from "./+types/home";
import Navbar from "../../componens/Navbar";
import Footer from "../../componens/Footer";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Trash2,
  AlertTriangle,
  Play,
  X,
} from "lucide-react";
import Button from "../../componens/ui/Button";
import Upload from "../../componens/Upload";
import { Link, useNavigate, useOutletContext } from "react-router";
import { useEffect, useRef, useState } from "react";
import {
  createProject,
  getProjects,
  deleteProject,
  getPublicProjects,
  getCurrentUser,
  pingWorker,
} from "../../lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "VisionArch | Shape the room" },
    {
      name: "description",
      content: "Turn floor plans into clear, shareable design studies.",
    },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { isSignedIn, signIn } = useOutletContext<AuthContext>();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const isCreatingProjectRef = useRef(false);

  const handleUploadComplete = async (base64Image: string) => {
    try {
      if (isCreatingProjectRef.current) return false;
      isCreatingProjectRef.current = true;
      const newId = Date.now().toString();
      const name = `Residence ${newId}`;

      const newItem = {
        id: newId,
        name,
        sourceImage: base64Image,
        renderedImage: undefined,
        timestamp: Date.now(),
      };

      const saved = await createProject({
        item: newItem,
        visibility: "private",
      });

      if (!saved) {
        console.error("Failed to create project");
        return false;
      }

      setProjects((prev) => [saved, ...prev]);

      navigate(`/visualizer/${newId}`, {
        state: {
          initialImage: saved.sourceImage,
          initialRendered: saved.renderedImage || null,
          name,
        },
      });

      return true;
    } finally {
      isCreatingProjectRef.current = false;
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    await deleteProject(deleteTargetId);
    setProjects((prev) => prev.filter((p) => p.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  const cancelDelete = () => setDeleteTargetId(null);

  const handleStartBuilding = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isSignedIn) {
      e.preventDefault();
      void signIn();
      return;
    }

    navigate("/draw");
  };

  useEffect(() => {
    if (!isSignedIn) {
      setProjects([]);
      return;
    }

    const fetchProjects = async () => {
      await pingWorker();

      const user = await getCurrentUser();
      const currentUserId = user?.uuid || null;

      if (!currentUserId) return;

      const [myPrivateProjects, allPublicProjects] = await Promise.all([
        getProjects(),
        getPublicProjects(),
      ]);

      const myPublicProjects = currentUserId
        ? allPublicProjects.filter(
            (p: DesignItem) => p.ownerId === currentUserId,
          )
        : [];

      const myProjects = [...myPrivateProjects, ...myPublicProjects];
      myProjects.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setProjects(myProjects);
    };

    fetchProjects();
  }, [isSignedIn]);

  return (
    <div className="home">
      <Navbar />

      <section className="home-hero">
        <img
          className="home-hero-image"
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=88"
          alt="Warm modern home set into a quiet desert landscape"
        />
        <div className="home-hero-shade" />
        <div className="home-hero-content">
          <p className="home-eyebrow">A little room to imagine</p>
          <h1>
            Make room
            <br />
            for the rest
            <br />
            of life.
          </h1>
          <p className="home-hero-copy">
            Your home should feel like you. Start with a sketch, a floor plan,
            or simply the feeling you want to come home to.
          </p>
          <div className="home-hero-actions">
            <a className="home-explore" href="#room-start">
              Explore your room <ArrowRight size={16} />
            </a>
            <Link to="/draw" onClick={handleStartBuilding} className="home-sketch-link">
              Start with a sketch
            </Link>
          </div>
        </div>
        <div className="home-hero-aside">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=82"
            alt="Sunlit living room with natural textures"
          />
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=700&q=82"
            alt="Quiet contemporary interior with a garden view"
          />
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=82"
            alt="Modern home nestled into a natural landscape"
          />
          <span>Spaces to come back to</span>
        </div>
        <p className="home-hero-note">Room to think. Space to make it yours.</p>
      </section>

      <section className="home-intro">
        <p className="home-section-label">A more personal way to plan</p>
        <div className="home-intro-copy">
          <h2>Every home begins with a feeling.</h2>
          <p>
            The chair you inherited. The light at four in the afternoon. The
            corner that never quite works. Roomify helps you try things out
            before you move a single thing.
          </p>
        </div>
        <div className="home-intro-aside">
          <span>Start anywhere</span>
          <span>Change your mind</span>
          <span>Make it yours</span>
        </div>
      </section>

      <section className="home-inspiration" aria-labelledby="inspiration-title">
        <div className="home-section-heading">
          <div>
            <p className="home-section-label">A few places to begin</p>
            <h2 id="inspiration-title">Find your kind of room.</h2>
          </div>
          <span>01 / 03</span>
        </div>
        <div className="inspiration-grid">
          <article className="inspiration-item">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"
              alt="A warm living room with timber details and a soft afternoon glow"
            />
            <div><h3>Slow mornings</h3><p>Natural light, warm wood, nowhere to rush.</p></div>
          </article>
          <article className="inspiration-item inspiration-item-tall">
            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"
              alt="An open, calm living space looking out to greenery"
            />
            <div><h3>A little more breathing room</h3><p>Open spaces that still feel like home.</p></div>
          </article>
          <article className="inspiration-item">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85"
              alt="A sculptural modern home framed by desert plants"
            />
            <div><h3>Somewhere to settle in</h3><p>Good design makes everyday life feel considered.</p></div>
          </article>
        </div>
      </section>

      <section className="room-start" id="room-start">
        <div className="room-start-copy">
          <p className="home-section-label">Your room, your starting point</p>
          <h2>Let’s see what it could become.</h2>
          <p>
            Bring in a room photo or floor plan. We’ll keep the original close
            while you explore what might feel better.
          </p>
          <Link to="/draw" onClick={handleStartBuilding} className="room-start-draw">
            Or start with a blank sketch <ArrowRight size={16} />
          </Link>
        </div>
        <div className="room-start-upload">
          <h3>Bring your room in</h3>
          <Upload onComplete={handleUploadComplete} />
        </div>
      </section>

      <section className="home-film">
        <button
          type="button"
          className="home-film-poster"
          onClick={() => setIsDemoOpen(true)}
          aria-label="Watch the Roomify demo"
        >
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=88"
            alt="A modern home glowing in the evening light"
          />
          <span className="home-film-play"><Play size={20} fill="currentColor" /></span>
          <span className="home-film-caption">A room can change everything.</span>
        </button>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Your Projects</h2>
              <p>
                Everything you've built, private and shared, all in one place.
              </p>
            </div>
          </div>

          <div className="projects-grid">
            {projects.map(
              (
                { id, name, renderedImage, sourceImage, timestamp, isPublic },
                index,
              ) => (
                <div
                  key={`${id}-${index}`}
                  className="project-card group"
                  onClick={() => navigate(`/visualizer/${id}`)}
                >
                  <div className="preview">
                    <img src={renderedImage || sourceImage} alt="Project" />

                    <div className="badge">
                      <span>{isPublic ? "Shared" : "Private"}</span>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={(e) => handleDeleteClick(e, id)}
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="card-body">
                    <div>
                      <h3>{name}</h3>

                      <div className="meta flex items-center gap-1.5 text-gray-500 text-xs">
                        <Clock size={14} className="h-3.5 w-3.5 shrink-0" />
                        <span>{new Date(timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="arrow">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {deleteTargetId && (
        <div className="auth-modal">
          <div className="panel">
            <div className="icon">
              <AlertTriangle className="alert" />
            </div>

            <h3>Delete Project?</h3>
            <p>
              This action cannot be undone. The project will be permanently
              removed.
            </p>

            <div className="actions">
              <Button className="confirm" onClick={confirmDelete}>
                Delete Project
              </Button>
              <button className="cancel" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDemoOpen && (
        <div className="demo-modal" onClick={() => setIsDemoOpen(false)}>
          <div
            className="demo-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="demo-close" onClick={() => setIsDemoOpen(false)}>
              <X size={20} />
            </button>
            <video src="/demo.mp4" controls autoPlay className="demo-video" />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
