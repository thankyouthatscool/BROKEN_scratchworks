import { resolve } from "path";
import { platform } from "os";

export const DOWNLOADS_DIR =
  platform() === "win32"
    ? resolve("/Users/ozahn/Downloads").replaceAll("\\", "/")
    : resolve("/Users/ozahn/Downloads");

export const MOVIE_EXTENSIONS = ["mp4"];
export const MOVE_DIR = `${DOWNLOADS_DIR}/__MOVE__`;

export const PLATFORM = platform();

export const SCENE_MOVIE_REGEX = /^(?<title>.*).?(?<year>\d{4}).?(\d{3,4})p/;
