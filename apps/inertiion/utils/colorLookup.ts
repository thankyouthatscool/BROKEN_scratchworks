import { GRAY_800 } from "@theme";

export const colorLookup = (color: string) => {
  switch (color.toLowerCase()) {
    // Black
    case "black":
    case "blk":
      return { background: "black", border: "black" };

    // Greys
    case "dark grey":
    case "dark gray":
    case "dkg":
      return { background: GRAY_800, border: GRAY_800 };

    // Gold
    case "gold":
      return colorFormat("#FFCB05");

    // Greens
    case "olive green":
      return colorFormat("#808000");

    // Natural
    case "natural":
    case "nat":
      return { background: "#F3EED8", border: "#F3EED8" };

    // Blues
    case "dark navy":
    case "dk navy":
      return { background: "#1D2545", border: "#1D2545" };
    case "navy":
      return { background: "#000080", border: "#000080" };
    case "royal":
      return { background: "#4169E1", border: "#4169E1" };
    case "sky blue":
      return colorFormat("#77C4FE");
    // Pinks
    case "pink":
      return colorFormat("#FFC0CB");
    case "hot pink":
      return colorFormat("#E55982");

    // Reds
    case "red":
      return { background: "#FF0000", border: "#FF0000" };

    // White
    case "white":
    case "wh":
      return { background: "white", border: "black" };
    default:
      return { background: "white", border: "black" };
  }
};

const colorFormat = (hexColorString: string) => {
  return { background: hexColorString, border: hexColorString };
};
