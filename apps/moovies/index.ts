import { rename } from "fs";
import glob from "glob";
import inquirer from "inquirer";

import { DOWNLOADS_DIR, MOVIE_EXTENSIONS, SCENE_MOVIE_REGEX } from "@constants";
import { parseMovieName } from "@utils";

const main = async () => {
  const videoFilesLocation = glob.sync(
    `${DOWNLOADS_DIR.replaceAll("\\", "/")}/**/*.+(${MOVIE_EXTENSIONS.join(
      "|"
    )})`
  );

  const sceneMovies = videoFilesLocation.filter((location) =>
    SCENE_MOVIE_REGEX.test(location)
  );

  const files = sceneMovies.map((movie) => parseMovieName(movie));

  if (!files.length) {
    console.log("No movies to rename.");
  } else {
    console.log(files);

    console.log(`There are ${files.length} files ready to be renamed.`);

    const confirmPromptMessage = "verifyConfirm";

    const res = await inquirer.prompt([
      {
        name: confirmPromptMessage,
        message: "Do the file names/locations look right?",
        type: "confirm",
      },
    ]);

    const promptResponse: boolean = res[confirmPromptMessage];

    if (promptResponse) {
      files.forEach((file) => {
        rename(file.originalLocation, file.newLocation, () => {});
      });
    } else {
    }
  }
};

main();
