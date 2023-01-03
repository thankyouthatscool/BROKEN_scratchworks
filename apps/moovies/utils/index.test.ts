import { parseMovieName } from ".";

describe("parseMovieName", () => {
  test("title with two year strings in it", () => {
    const res = parseMovieName("Smile.2011.2022.2023.2102.1080p.RARBG.mp4");

    expect(res.movieName).toBe("Smile 2011 2022 2023");
    expect(res.movieYear).toBe("2102");
  });
});
