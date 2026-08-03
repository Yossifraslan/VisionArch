import {
  Tldraw,
  useEditor,
  createShapeId,
  renderRichTextFromHTML,
} from "tldraw";
import "tldraw/tldraw.css";
import { useEffect, useState } from "react";
import { useNavigate, Link, useOutletContext } from "react-router";
import { Box, X, Sparkles, LayoutTemplate, AlertTriangle } from "lucide-react";
import { createProject } from "../../lib/puter.action";
import { FLOOR_PLAN_TEMPLATES } from "../../lib/templates";

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const HINT_STORAGE_KEY = "visionarch_draw_hint_seen";

const DrawHint = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(HINT_STORAGE_KEY);
    if (!seen) {
      setIsVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(HINT_STORAGE_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="draw-hint">
      <p>
        <strong>Sketch your rooms</strong>, then hit{" "}
        <strong>Generate 3D Render</strong> to bring it to life. Or load a
        template to get started fast.
      </p>
      <button onClick={dismiss}>
        <X size={16} />
      </button>
    </div>
  );
};

const TemplatesMenu = () => {
  const editor = useEditor();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingTemplateKey, setPendingTemplateKey] = useState<string | null>(
    null,
  );

  const applyTemplate = (templateKey: string) => {
    const template = FLOOR_PLAN_TEMPLATES[templateKey];
    if (!template) return;

    const existingIds = Array.from(editor.getCurrentPageShapeIds());
    if (existingIds.length > 0) {
      editor.deleteShapes(existingIds);
    }

    const shapes = template.shapes.map((shape) => ({
      id: createShapeId(),
      type: "geo" as const,
      x: shape.x,
      y: shape.y,
      props: {
        geo: "rectangle" as const,
        w: shape.w,
        h: shape.h,
        color: "black" as const,
        fill: "none" as const,
        richText: renderRichTextFromHTML(editor, shape.label),
      },
    }));

    editor.createShapes(shapes);
    editor.zoomToFit();
    setIsOpen(false);
  };

  const handleSelectTemplate = (templateKey: string) => {
    const existingIds = Array.from(editor.getCurrentPageShapeIds());

    if (existingIds.length > 0) {
      setPendingTemplateKey(templateKey);
      setIsOpen(false);
      return;
    }

    applyTemplate(templateKey);
  };

  const confirmApply = () => {
    if (pendingTemplateKey) {
      applyTemplate(pendingTemplateKey);
    }
    setPendingTemplateKey(null);
  };

  const cancelApply = () => setPendingTemplateKey(null);

  return (
    <>
      <div className="templates-menu">
        <button
          className="templates-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <LayoutTemplate size={16} />
          Templates
        </button>

        {isOpen && (
          <div className="templates-dropdown">
            {Object.entries(FLOOR_PLAN_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                className="template-option"
                onClick={() => handleSelectTemplate(key)}
              >
                <span className="template-name">{template.name}</span>
                <span className="template-desc">{template.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {pendingTemplateKey && (
        <div className="auth-modal">
          <div className="panel">
            <div className="icon">
              <AlertTriangle className="alert" />
            </div>

            <h3>Replace Current Drawing?</h3>
            <p>
              Loading this template will clear your current drawing. This can't
              be undone.
            </p>

            <div className="actions">
              <button className="confirm btn" onClick={confirmApply}>
                Load Template
              </button>
              <button className="cancel" onClick={cancelApply}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DrawCanvas = () => {
  const editor = useEditor();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    const shapeIds = Array.from(editor.getCurrentPageShapeIds());

    if (shapeIds.length === 0) {
      alert("Draw something first before generating a render.");
      return;
    }

    setIsGenerating(true);

    try {
      const result = await editor.toImage(shapeIds, {
        format: "png",
        background: true,
        padding: 32,
        scale: 2,
      });

      if (!result) {
        console.error("Export failed");
        setIsGenerating(false);
        return;
      }

      const base64Image = await blobToBase64(result.blob);

      const newId = Date.now().toString();
      const name = `Sketch ${newId}`;

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
        console.error("Failed to create project from drawing");
        setIsGenerating(false);
        return;
      }

      navigate(`/visualizer/${newId}`, {
        state: {
          initialImage: saved.sourceImage,
          initialRendered: saved.renderedImage || null,
          name,
        },
      });
    } catch (error) {
      console.error("Failed to generate from drawing:", error);
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="draw-overlay-ui">
        <button
          className="draw-generate-btn"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <Sparkles size={16} />
          {isGenerating ? "Generating..." : "Generate 3D Render"}
        </button>
      </div>

      <div className="draw-templates-ui">
        <TemplatesMenu />
      </div>

      <DrawHint />
    </>
  );
};

export default function Draw() {
  const navigate = useNavigate();
  const { isSignedIn, signIn } = useOutletContext<AuthContext>();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!isSignedIn) {
        try {
          await signIn();
          setIsCheckingAuth(false);
        } catch {
          navigate("/");
        }
      } else {
        setIsCheckingAuth(false);
      }
    };

    check();
  }, [isSignedIn]);

  if (isCheckingAuth && !isSignedIn) {
    return (
      <div className="draw-auth-guard">
        <p>Signing you in...</p>
      </div>
    );
  }

  return (
    <div className="draw-page">
      <div className="draw-topbar">
        <Link to="/" className="brand">
          <Box className="logo" />
          <span className="name">VisionArch</span>
        </Link>

        <button className="draw-exit" onClick={() => navigate("/")}>
          <X size={18} /> Exit
        </button>
      </div>

      <div className="draw-canvas-wrap">
        <Tldraw
          persistenceKey="visionarch-draw"
          licenseKey={import.meta.env.VITE_TLDRAW_LICENSE_KEY}
        >
          <DrawCanvas />
        </Tldraw>
      </div>
    </div>
  );
}
