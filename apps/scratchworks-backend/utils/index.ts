import { writeFileSync } from "fs";
import { resolve } from "path";

export const updateAppApiUrl = (apiUrl: string) => {
  const appDirectory = resolve(__dirname, "../../inertiion");

  writeFileSync(resolve(appDirectory, ".api.env"), `API_URL=${apiUrl}`);
};
