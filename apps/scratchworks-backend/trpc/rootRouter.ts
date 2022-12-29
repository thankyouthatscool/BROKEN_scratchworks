import { inertiionRouter } from "./routes";
import { router } from ".";

export const appRouter = router({ inertiion: inertiionRouter });

export type AppRouter = typeof appRouter;
