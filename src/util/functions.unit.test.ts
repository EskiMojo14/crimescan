import {
  hasKey,
  uniqueArray,
  countInArray,
  addOrRemove,
  alphabeticalSort,
  alphabeticalSortProp,
  delay,
  iconObject,
} from "./functions";

describe("Checks if provided object has specified key", () => {
  it("should return true if object has key", () => {
    expect(hasKey({ key: "value" }, "key")).toBe(true);
  });
  it("should return false if object doesn't have key", () => {
    expect(hasKey({ key: "value" }, "key2")).toBe(false);
  });
});

describe("Removes all duplicate values in an array", () => {
  it("should return the provided array without duplicates", () => {
    expect(uniqueArray(["item", "item"])).toEqual(["item"]);
  });
});

describe("Counts how many of the specified item are in the provided array", () => {
  it("should return 2 if two of the element exist", () => {
    expect(countInArray([1, 1, 2, 3], 1)).toBe(2);
  });
});

describe(`"Toggles" an element in an array.`, () => {
  it("should add the item if it's not in the array", () => {
    expect(addOrRemove([1, 2], 3)).toEqual([1, 2, 3]);
  });
  it("should remove the item if it's in the array", () => {
    expect(addOrRemove([1, 2, 3], 3)).toEqual([1, 2]);
  });
});

describe("Sorts an array of strings alphabetically", () => {
  it("should sort the array alphabetically in ascending order", () => {
    expect(alphabeticalSort(["b", "a", "c", "c"])).toEqual(["a", "b", "c", "c"]);
  });
  it("should sort the array alphabetically in descending order if specified", () => {
    expect(alphabeticalSort(["b", "a", "c"], true)).toEqual(["c", "b", "a"]);
  });
});

describe("Sorts an array of objects alphabetically by a specified key", () => {
  it("should sort the array alphabetically by the specified key", () => {
    expect(alphabeticalSortProp([{ key: "b" }, { key: "a" }, { key: "c" }, { key: "c" }], "key")).toEqual([
      { key: "a" },
      { key: "b" },
      { key: "c" },
      { key: "c" },
    ]);
  });
  it("should sort the array in descending order if specified", () => {
    expect(alphabeticalSortProp([{ key: "b" }, { key: "a" }, { key: "c" }], "key", true)).toEqual([
      { key: "c" },
      { key: "b" },
      { key: "a" },
    ]);
  });
  it("should sort hoist a specified value to the beginning of the array", () => {
    expect(alphabeticalSortProp([{ key: "b" }, { key: "a" }, { key: "c" }], "key", false, "c")).toEqual([
      { key: "c" },
      { key: "a" },
      { key: "b" },
    ]);
  });
});

describe("Delays for specified amount of milliseconds, then returns a promise", () => {
  it("should return a resolved promise", () => {
    return expect(delay(20)).resolves.toBe(undefined);
  });
  it("should return a resolved promise with the specified value", () => {
    return expect(delay(20, "test")).resolves.toBe("test");
  });
});

describe("Creates an object suitable for RMWC's icon prop", () => {
  it("should return an object with the specified contents", () => {
    expect(iconObject("home")).toEqual({
      strategy: "component",
      icon: "home",
    });
  });
  it("should include any other additional config", () => {
    expect(iconObject("home", { size: "small" })).toEqual({
      strategy: "component",
      icon: "home",
      size: "small",
    });
  });
});
