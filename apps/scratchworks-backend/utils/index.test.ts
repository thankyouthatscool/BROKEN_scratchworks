import { generateCode } from "./index";

test("generateCode should return a number that is x characters long", () => {
  const CODE_LENGTH = 6;

  expect(generateCode(CODE_LENGTH).toString().split("").length).toBe(
    CODE_LENGTH
  );
});
