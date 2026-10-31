import type { Route } from "./+types/home";
import Navbar from "../../componens/Navbar";
import Footer from "../../componens/Footer";
import {
  ArrowUpRight,
  Clock,
  Trash2,
  AlertTriangle,
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
  const { isSignedIn } = useOutletContext<AuthContext>();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
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

      <section className="home-simple">
        <div className="home-simple-copy">
          <p className="home-kicker">ROOM PLANNING, MADE SIMPLE</p>
          <h1>Plan a room</h1>
          <p>Upload a room photo or start with a quick floor plan sketch.</p>
          <Link to="/draw" className="home-sketch-link">Start with a sketch</Link>
        </div>
        <div className="home-simple-upload">
          <h2>Upload a room photo</h2>
          <Upload onComplete={handleUploadComplete} />
        </div>
      </section>

      {projects.length > 0 && <section className="projects">
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
              ) => {
                const projectPath = `/visualizer/${id}`;
                const projectState = {
                  initialImage: sourceImage,
                  initialRendered: renderedImage || null,
                  name,
                  timestamp,
                  isPublic,
                };

                return (
                <article key={`${id}-${index}`} className="project-card group">
                  <div className="preview">
                    <Link
                      to={projectPath}
                      state={projectState}
                      className="project-card-preview-link"
                      aria-label={`Open ${name}`}
                    >
                      <img src={renderedImage || sourceImage} alt="Project" />
                      <div className="badge">
                        <span>{isPublic ? "Shared" : "Private"}</span>
                      </div>
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={(e) => handleDeleteClick(e, id)}
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <Link
                    to={projectPath}
                    state={projectState}
                    className="card-body project-card-body-link"
                  >
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
                  </Link>
                </article>
                );
              },
            )}
          </div>
        </div>
      </section>}

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

      <Footer />
    </div>
  );
}
