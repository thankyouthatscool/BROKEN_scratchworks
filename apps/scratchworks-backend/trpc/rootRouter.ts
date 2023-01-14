import { controllarRouter, inertiionRouter } from "./routes";
import { router } from ".";

export const appRouter = router({
  controllar: controllarRouter,
  inertiion: inertiionRouter,
});

export type AppRouter = typeof appRouter;
