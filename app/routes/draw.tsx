import { Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Box, X, Sparkles } from "lucide-react";
import { createProject } from "../../lib/puter.action";

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
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
  );
};

export default function Draw() {
  const navigate = useNavigate();

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
        <Tldraw persistenceKey="visionarch-draw">
          <DrawCanvas />
        </Tldraw>
      </div>
    </div>
  );
}
