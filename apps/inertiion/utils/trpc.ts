import { AppRouter } from "@scratchworks/scratchworks-backend";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
