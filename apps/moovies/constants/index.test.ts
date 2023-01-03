import * as os from "os";

import { DOWNLOADS_DIR } from ".";

describe("Constants", () => {
  // @ts-ignore
  //   os.platform = jest.fn(() => "linux");

  test("DOWNLOADS_DIR", () => {
    expect(DOWNLOADS_DIR).toBe("C:/Users/ozahn/Downloads");
  });
});
