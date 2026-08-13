import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "./routes/about.tsx"),
  route("privacy", "./routes/privacy.tsx"),
  route("visualizer/:id", "./routes/visualizer.$id.tsx"),
  route("community", "./routes/community.tsx"),
  route("draw", "./routes/draw.tsx"),
] satisfies RouteConfig;
