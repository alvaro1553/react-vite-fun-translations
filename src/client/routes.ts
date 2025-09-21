import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("translate", "routes/translate.tsx"),
] satisfies RouteConfig;
