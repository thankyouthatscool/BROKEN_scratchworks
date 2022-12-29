import { writeFileSync } from "fs";
import { resolve } from "path";

export const updateAppApiUrl = (apiUrl: string) => {
  const appDirectory = resolve(__dirname, "../../inertiion");

  writeFileSync(resolve(appDirectory, ".api.env"), `API_URL=${apiUrl}`);
};

export const generateCode = (length: number) => {
  return parseInt(
    Array.from({ length })
      .map(() => Math.floor(Math.random() * 10))
      .join("")
  );
};
