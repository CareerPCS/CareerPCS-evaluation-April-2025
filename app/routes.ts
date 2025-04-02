import { flatRoutes } from "@react-router/fs-routes";
import { type RouteConfig, route } from "@react-router/dev/routes";

export default [...(await flatRoutes())] satisfies RouteConfig;
