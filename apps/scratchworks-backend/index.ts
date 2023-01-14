import "module-alias/register";

import * as trpcExpress from "@trpc/server/adapters/express";
import { AxiosError } from "axios";
import { config } from "dotenv";
import express from "express";
import { exit } from "process";

import { appRouter, createContext } from "@router";

export { User } from "@prisma/client";
export * from "./trpc";

config();

const NODE_ENV = process.env.NODE_ENV;

const app = express();

app.get("/", (_, res) => {
  return res.status(200).json({ message: "OK" });
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
);

const startServer = async (port?: number) => {
  const PORT = port || parseInt(process.env.SERVER_PORT!);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
};

const main = async () => {
  if (NODE_ENV === "development") {
    console.log("Running in dev...");

    try {
      startServer(5001);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.message);
      } else {
        console.log(err);

        console.log("Something went horribly wrong.\nExiting.");
      }
      exit(1);
    }
  } else if (NODE_ENV === "prod") {
    console.log("Running in prod...");

    startServer();
  } else {
    console.log("NODE_ENV not set.\nExiting.");

    exit(1);
  }
};

main();
