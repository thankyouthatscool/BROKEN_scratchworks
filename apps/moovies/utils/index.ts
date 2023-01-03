import { parse } from "path";

import { MOVE_DIR } from "@constants";

export const parseMovieName = (fileString: string) => {
  const { base, ext } = parse(fileString);

  const fileNameStringArray = base.split(".");

  const { index, item: year } = fileNameStringArray
    .map((item, index) => {
      if (/^\d{4}$/gi.test(item)) {
        return { item, index };
      } else {
        return null;
      }
    })
    .filter((item) => !!item)
    .sort((a, b) => b?.index! - a?.index!)[0]!;

  const movieNameString = fileNameStringArray.slice(0, index).join(" ");

  const formattedMovieNameString = `${movieNameString} (${year})${ext}`;

  return {
    originalLocation: fileString,
    movieFileExtension: ext,
    movieName: movieNameString,
    movieYear: year,
    newLocation: `${MOVE_DIR}/${formattedMovieNameString}`,
  };
};
