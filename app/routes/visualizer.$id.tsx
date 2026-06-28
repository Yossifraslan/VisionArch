import { useNavigate, useOutletContext, useParams, Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import { generate3DView } from "../../lib/ai.action";
import { STYLE_MODIFIERS } from "../../lib/constants";
import { Box, Download, RefreshCcw, Share2, X, Pencil } from "lucide-react";
import Button from "../../componens/ui/Button";
import {
  createProject,
  getProjectById,
  shareProject,
  unshareProject,
  renameProject,
} from "../../lib/puter.action";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

const VisualizerId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useOutletContext<AuthContext>();

  const hasInitialGenerated = useRef(false);

  const [project, setProject] = useState<DesignItem | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>("default");

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleBack = () => navigate("/");

  const handleExport = () => {
    if (!currentImage) return;

    const link = document.createElement("a");
    link.href = currentImage;
    link.download = `roomify-${id || "design"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareToggle = async () => {
    if (!project) return;
    setIsSharing(true);
    try {
      if (project.isPublic) {
        const updated = await unshareProject(project.id);
        if (updated) setProject(updated);
      } else {
        const updated = await shareProject(project.id);
        if (updated) setProject(updated);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const startEditingName = () => {
    setNameInput(project?.name || "");
    setIsEditingName(true);
  };

  const saveNameEdit = async () => {
    setIsEditingName(false);

    if (!project || !nameInput.trim() || nameInput.trim() === project.name) {
      return;
    }

    const updated = await renameProject(project.id, nameInput.trim());
    if (updated) setProject(updated);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setIsEditingName(false);
    }
  };

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const runGeneration = async (item: DesignItem, style: string = "default") => {
    if (!id || !item.sourceImage) return;

    try {
      setIsProcessing(true);
      const result = await generate3DView({
        sourceImage: item.sourceImage,
        style,
      });

      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);

        const updatedItem = {
          ...item,
          renderedImage: result.renderedImage,
          renderedPath: result.renderedPath,
          timestamp: Date.now(),
          ownerId: item.ownerId ?? userId ?? null,
          isPublic: item.isPublic ?? false,
        };

        const saved = await createProject({
          item: updatedItem,
          visibility: "private",
        });

        if (saved) {
          setProject(saved);
          // Note: intentionally NOT calling setCurrentImage(saved.renderedImage) here.
          // result.renderedImage is the fresh base64 data straight from generation —
          // saved.renderedImage may be a hosted URL that hasn't fully propagated yet,
          // which previously caused the UI to show a stale image until manual refresh.
        }
      }
    } catch (error) {
      console.error("Generation failed: ", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegenerate = () => {
    if (!project) return;
    void runGeneration(project, selectedStyle);
  };

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!id) {
        setIsProjectLoading(false);
        return;
      }

      setIsProjectLoading(true);

      const fetchedProject = await getProjectById({ id });

      if (!isMounted) return;

      setProject(fetchedProject);
      setCurrentImage(fetchedProject?.renderedImage || null);
      setIsProjectLoading(false);
      hasInitialGenerated.current = false;
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (
      isProjectLoading ||
      hasInitialGenerated.current ||
      !project?.sourceImage
    )
      return;

    if (project.renderedImage) {
      setCurrentImage(project.renderedImage);
      hasInitialGenerated.current = true;
      return;
    }

    hasInitialGenerated.current = true;
    void runGeneration(project, selectedStyle);
  }, [project, isProjectLoading]);

  return (
    <div className="visualizer">
      <nav className="topbar">
        <Link to="/" className="brand">
          <Box className="logo" />

          <span className="name">VisionArch</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
          <X className="icon" /> Exit Editor
        </Button>
      </nav>

      <section className="content">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Project</p>

              {isEditingName ? (
                <input
                  ref={nameInputRef}
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={saveNameEdit}
                  onKeyDown={handleNameKeyDown}
                  className="name-edit-input"
                />
              ) : (
                <h2 className="editable-name" onClick={startEditingName}>
                  {project?.name || `Residence ${id}`}
                  <Pencil size={14} className="edit-icon" />
                </h2>
              )}

              <p className="note">Created by You</p>
            </div>

            <div className="panel-actions">
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="style-select"
                disabled={isProcessing}
              >
                {Object.keys(STYLE_MODIFIERS).map((style) => (
                  <option key={style} value={style}>
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>

              <Button
                size="sm"
                onClick={handleRegenerate}
                className="regenerate"
                disabled={isProcessing || !project}
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Regenerate
              </Button>

              <Button
                size="sm"
                onClick={handleExport}
                className="export"
                disabled={!currentImage}
              >
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button
                size="sm"
                onClick={handleShareToggle}
                className="share"
                disabled={isSharing || !project}
              >
                <Share2 className="w-4 h-4 mr-2" />
                {project?.isPublic ? "Unshare" : "Share"}
              </Button>
            </div>
          </div>

          <div className={`render-area ${isProcessing ? "is-processing" : ""}`}>
            {currentImage ? (
              <img src={currentImage} alt="AI Render" className="render-img" />
            ) : (
              <div className="render-placeholder">
                {project?.sourceImage && (
                  <img
                    src={project?.sourceImage}
                    alt="Original"
                    className="render-fallback"
                  />
                )}
              </div>
            )}

            {isProcessing && (
              <div className="render-overlay">
                <div className="rendering-card">
                  <RefreshCcw className="spinner" />
                  <span className="title">Rendering...</span>
                  <span className="subtitle">
                    Generating your 3D visualization
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="panel compare">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Comparison</p>
              <h3>Before and After</h3>
            </div>
            <div className="hint">Drag to compare</div>
          </div>

          <div className="compare-stage">
            {project?.sourceImage && currentImage ? (
              <ReactCompareSlider
                defaultValue={50}
                style={{ width: "100%", height: "100%" }}
                itemOne={
                  <ReactCompareSliderImage
                    src={project?.sourceImage}
                    alt="before"
                    style={{ objectFit: "contain", objectPosition: "center" }}
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={currentImage || project?.renderedImage || undefined}
                    alt="after"
                    style={{ objectFit: "contain", objectPosition: "center" }}
                  />
                }
              />
            ) : (
              <div className="compare-fallback">
                {project?.sourceImage && (
                  <img
                    src={project.sourceImage}
                    alt="Before"
                    className="compare-img"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default VisualizerId;

