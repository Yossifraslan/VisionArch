import type { Route } from "./+types/home";
import Navbar from "../../componens/Navbar";
import Footer from "../../componens/Footer";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Layers,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import Button from "../../componens/ui/Button";
import Upload from "../../componens/Upload";
import { useNavigate } from "react-router";
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

  useEffect(() => {
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
  }, []);

  return (
    <div className="home">
      <Navbar />

      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>

          <p>Introducing VisionArch</p>
        </div>

        <h1>Build beautiful spaces at the speed of thought with VisionArch</h1>

        <p className="subtitle">
          VisionArch is an AI-first design environment that helps you visualize,
          render, and ship architectural projects faster than ever.
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start Building <ArrowRight className="icon" />
          </a>

          <Button
            variant="outline"
            size="lg"
            className="demo"
            onClick={() => setIsDemoOpen(true)}
          >
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

              <h3>Upload your floor plan</h3>
              <p>Supports JPG, PNG, formats up to 10MB</p>
            </div>

            <Upload onComplete={handleUploadComplete} />
          </div>
        </div>
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

                      <div className="meta">
                        <Clock size={12} />
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
