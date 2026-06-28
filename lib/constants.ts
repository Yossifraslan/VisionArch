export const PUTER_WORKER_URL = import.meta.env.VITE_PUTER_WORKER_URL || "";

// Storage Paths
export const STORAGE_PATHS = {
  ROOT: "VisionArch",
  SOURCES: "VisionArch/sources",
  RENDERS: "VisionArch/renders",
} as const;

// Timing Constants (in milliseconds)
export const SHARE_STATUS_RESET_DELAY_MS = 1500;
export const PROGRESS_INCREMENT = 15;
export const REDIRECT_DELAY_MS = 600;
export const PROGRESS_INTERVAL_MS = 100;
export const PROGRESS_STEP = 5;

// UI Constants
export const GRID_OVERLAY_SIZE = "60px 60px";
export const GRID_COLOR = "#3B82F6";

// HTTP Status Codes
export const UNAUTHORIZED_STATUSES = [401, 403];

// Image Dimensions
export const IMAGE_RENDER_DIMENSION = 1024;

export const VISIONARCH_RENDER_PROMPT = `
TASK: Convert the input 2D floor plan into a **photorealistic, top‑down 3D architectural render**.

ABSOLUTE TOP PRIORITY RULE — TEXT REMOVAL:
**DO NOT render any text, letters, numbers, labels, room names, dimensions, or annotations anywhere in the output image.**
This includes text that appears INSIDE rooms (e.g. "Bathroom", "Kitchen", "Bedroom", "Living Room"), text near walls, text on furniture, and any handwritten or printed labels from the original plan.
Wherever text appeared in the original floor plan, that area must be rendered as plain, continuous floor material — as if no text was ever there. Treat all text as invisible; it must NOT be transcribed, paraphrased, redrawn, or echoed in any form in the final image.
The final image must look like a real photograph of a physical space — real spaces do not have floating text labels in them.

STRICT REQUIREMENTS (do not violate):
1) **REMOVE ALL TEXT**: Do not render any letters, numbers, labels, dimensions, or annotations. Floors must be continuous where text used to be.
2) **GEOMETRY MUST MATCH**: Walls, rooms, doors, and windows must follow the exact lines and positions in the plan. Do not shift or resize.
3) **TOP‑DOWN ONLY**: Orthographic top‑down view. No perspective tilt.
4) **CLEAN, REALISTIC OUTPUT**: Crisp edges, balanced lighting, and realistic materials. No sketch/hand‑drawn look.
5) **NO EXTRA CONTENT**: Do not add rooms, furniture, or objects that are not clearly indicated by the plan.

STRUCTURE & DETAILS:
- **Walls**: Extrude precisely from the plan lines. Consistent wall height and thickness.
- **Doors**: Convert door swing arcs into open doors, aligned to the plan.
- **Windows**: Convert thin perimeter lines into realistic glass windows.

FURNITURE & ROOM MAPPING (only where icons/fixtures are clearly shown):
- Bed icon → realistic bed with duvet and pillows.
- Sofa icon → modern sectional or sofa.
- Dining table icon → table with chairs.
- Kitchen icon → counters with sink and stove.
- Bathroom icon → toilet, sink, and tub/shower.
- Office/study icon → desk, chair, and minimal shelving.
- Porch/patio/balcony icon → outdoor seating or simple furniture (keep minimal).
- Utility/laundry icon → washer/dryer and minimal cabinetry.

STYLE & LIGHTING:
- Lighting: bright, neutral daylight. High clarity and balanced contrast.
- Materials: realistic wood/tile floors, clean walls, subtle shadows.
- Finish: professional architectural visualization; absolutely no text, no watermarks, no logos, no labels of any kind.

FINAL CHECK before output: scan the entire image for any remaining text or labels. If any text is present anywhere in the image, it is an error — the floor in that area should be plain and continuous instead.
`.trim();

export const STYLE_MODIFIERS: Record<string, string> = {
  default: "",
  modern: `
ADDITIONAL STYLE DIRECTION — Modern:
- Furniture: clean-lined, minimal ornamentation, neutral upholstery (greys, whites, black accents).
- Materials: matte wood floors, smooth painted walls, occasional matte black fixtures.
- Keep all geometry, walls, and room mapping rules above unchanged — only adjust furniture style and materials.
- Reminder: no text or labels anywhere in the output.`,
  minimalist: `
ADDITIONAL STYLE DIRECTION — Minimalist:
- Furniture: sparse, low-profile, only essential pieces per room, no clutter or decorative objects.
- Materials: white or light grey walls, pale wood or polished concrete floors, abundant negative space.
- Keep all geometry, walls, and room mapping rules above unchanged — only adjust furniture style and materials.
- Reminder: no text or labels anywhere in the output.`,
  industrial: `
ADDITIONAL STYLE DIRECTION — Industrial:
- Furniture: raw metal frames, leather or canvas upholstery, exposed hardware.
- Materials: exposed brick accent walls, polished concrete floors, black metal window frames.
- Keep all geometry, walls, and room mapping rules above unchanged — only adjust furniture style and materials.
- Reminder: no text or labels anywhere in the output.`,
  luxury: `
ADDITIONAL STYLE DIRECTION — Luxury:
- Furniture: high-end upholstered pieces, statement lighting fixtures, refined detailing.
- Materials: marble or polished stone floors, soft warm-toned walls, brass or gold fixture accents.
- Keep all geometry, walls, and room mapping rules above unchanged — only adjust furniture style and materials.
- Reminder: no text or labels anywhere in the output.`,
};
