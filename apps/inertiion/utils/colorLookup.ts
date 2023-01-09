import { GRAY_800 } from "@theme";

export const colorLookup = (color: string) => {
  switch (color.toLowerCase()) {
    // Black
    case "black":
    case "blk":
      return colorFormat("black");

    // Blues
    case "dark navy":
    case "dk navy":
      return colorFormat("#1D2545");
    case "navy":
      return colorFormat("#000080");
    case "roy":
    case "royal":
      return colorFormat("#4169E1");
    case "sky blue":
      return colorFormat("#77C4FE");
    case "sky":
    case "sky blue":
      return colorFormat("#87ceeb");
    case "aqua":
      return colorFormat("#bcd4e6");

    // Greys
    case "charcoal":
      return colorFormat("#36454f");
    case "dark charcoal":
      return colorFormat("#212b31");
    case "dark grey":
    case "dark gray":
    case "dkg":
      return colorFormat(GRAY_800);

    // Gold
    case "gold":
      return colorFormat("#FFCB05");

    // Greens
    case "olive green":
      return colorFormat("#808000");

    // Khaki
    case "khaki":
      return colorFormat("#c3b091");
    case "dark khaki":
      return colorFormat("#b19870");

    // Natural
    case "natural":
    case "nat":
      return colorFormat("#F3EED8");

    // Orange
    case "orange":
      return colorFormat("#ffa500");

    // Pinks
    case "pink":
      return colorFormat("#FFC0CB");
    case "hot pink":
      return colorFormat("#E55982");

    // Reds
    case "red":
      return colorFormat("#FF0000");

    // White
    case "white":
    case "wh":
      return { background: "white", border: "black" };
    default:
      return { background: "white", border: "black" };
  }
};

const colorFormat = (colorString: string) => {
  return { background: colorString, border: colorString };
};
