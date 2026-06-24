type TemplateShape = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
};

export const FLOOR_PLAN_TEMPLATES: Record<
  string,
  { name: string; description: string; shapes: TemplateShape[] }
> = {
  studio: {
    name: "Studio",
    description: "Single open room + bathroom",
    shapes: [
      { x: 100, y: 100, w: 400, h: 300, label: "Main Room" },
      { x: 500, y: 100, w: 120, h: 150, label: "Bathroom" },
    ],
  },

  oneBedroom: {
    name: "1-Bedroom",
    description: "Bedroom, living room, kitchen, bathroom",
    shapes: [
      { x: 100, y: 100, w: 280, h: 220, label: "Living Room" },
      { x: 100, y: 320, w: 280, h: 220, label: "Bedroom" },
      { x: 380, y: 100, w: 200, h: 220, label: "Kitchen" },
      { x: 380, y: 320, w: 200, h: 220, label: "Bathroom" },
    ],
  },

  twoBedroom: {
    name: "2-Bedroom",
    description: "Two bedrooms, living room, kitchen, bathroom",
    shapes: [
      { x: 100, y: 100, w: 260, h: 200, label: "Bedroom 1" },
      { x: 100, y: 300, w: 260, h: 200, label: "Bedroom 2" },
      { x: 380, y: 100, w: 320, h: 240, label: "Living Room" },
      { x: 380, y: 340, w: 160, h: 160, label: "Kitchen" },
      { x: 540, y: 340, w: 160, h: 160, label: "Bathroom" },
    ],
  },

  loft: {
    name: "Open Loft",
    description: "Single large open-plan space with one bedroom nook",
    shapes: [
      { x: 100, y: 100, w: 500, h: 350, label: "Open Living + Kitchen" },
      { x: 620, y: 100, w: 220, h: 200, label: "Bedroom Nook" },
      { x: 620, y: 320, w: 220, h: 130, label: "Bathroom" },
    ],
  },

  family: {
    name: "Family Home",
    description: "Three bedrooms, living, dining, kitchen, two bathrooms",
    shapes: [
      { x: 100, y: 100, w: 220, h: 180, label: "Bedroom 1" },
      { x: 100, y: 280, w: 220, h: 180, label: "Bedroom 2" },
      { x: 100, y: 460, w: 220, h: 180, label: "Bedroom 3" },
      { x: 340, y: 100, w: 140, h: 180, label: "Bath 1" },
      { x: 340, y: 280, w: 140, h: 180, label: "Bath 2" },
      { x: 500, y: 100, w: 320, h: 260, label: "Living Room" },
      { x: 500, y: 380, w: 160, h: 260, label: "Dining" },
      { x: 680, y: 380, w: 160, h: 260, label: "Kitchen" },
    ],
  },
};
