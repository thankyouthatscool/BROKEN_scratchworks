import type { User } from "@scratchworks/scratchworks-backend";

export type LocalUser = Omit<User, "password" | "applications">;
