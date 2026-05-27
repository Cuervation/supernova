export type ScreenId = "home" | "login" | "game" | "result" | "ranking";

export type ScreenConfig = {
  id: ScreenId;
  route: string;
  title: string;
  requiresAuth: boolean;
  status: "mvp" | "planned";
};

export const screensConfig: ScreenConfig[] = [
  { id: "home", route: "/", title: "Supernova", requiresAuth: false, status: "mvp" },
  { id: "login", route: "/login", title: "Ingresar", requiresAuth: false, status: "mvp" },
  { id: "game", route: "/game", title: "Juego", requiresAuth: true, status: "mvp" },
  { id: "result", route: "/result", title: "Resultado", requiresAuth: true, status: "mvp" },
  { id: "ranking", route: "/ranking", title: "Ranking", requiresAuth: true, status: "mvp" },
];
