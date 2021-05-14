import { hasKey } from "./functions";

describe("Checks if provided object has specified key", () => {
  it("should return true if object has key", () => {
    expect(hasKey({ key: "value" }, "key")).toBe(true);
  });
  it("should return false if object doesn't have key", () => {
    expect(hasKey({ key: "value" }, "key2")).toBe(false);
  });
});
