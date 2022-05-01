import { nanoid } from "@reduxjs/toolkit";
import { IconOptions, IconPropT } from "@rmwc/types";

/**
 * Checks that object contains specified key.
 * @param obj Object to be checked.
 * @param key Key to check against `obj`.
 * @returns Whether `obj` has the specified `key`.
 */

export const hasKey = <O>(obj: O, key: keyof any): key is keyof O => key in obj;

/**
 * Remove all duplicate values within an array.
 * @param arr Array of values.
 * @returns `array` with only unique values.
 */

export const uniqueArray = <T>(arr: T[]): T[] => arr.filter((item, index) => arr.indexOf(item) === index);

/**
 * Counts occurrences of specified value within provided array.
 * @param arr Array to be checked.
 * @param val Value to be counted.
 * @returns Amount of items within `arr` equal to `val`.
 */

export const countInArray = <T>(arr: T[], val: T) => arr.reduce((count, item) => count + Number(item === val), 0);

/**
 * "Toggles" an element in an array. *MUTATES*
 * @param array Array of values.
 * @param value Value to be added or removed (if already in `array`).
 * @returns `array` with element added or removed.
 */

export const addOrRemove = <T>(array: T[], value: T): T[] => {
  const index: number = array.indexOf(value);

  if (index === -1) {
    array.push(value);
  } else {
    array.splice(index, 1);
  }
  return array;
};

/**
 * Creates a function to pass to sort an array of items in alphabetical order.
 * @param descending Whether to sort the items in descending order. Defaults to false.
 * @param hoist Value to be hoisted to beginning of array.
 * @returns Function to pass `a` and `b` to.
 * @example <caption>Simple string sort</caption>
 * strArr.sort(alphabeticalSortCurried())
 * @example <caption>Simple string sort (descending)</caption>
 * strArr.sort(alphabeticalSortCurried(true))
 * @example <caption>Sorting by object key</caption>
 * objArr.sort((a, b) => alphabeticalSortCurried()(a.key, b.key))
 * @example <caption>Sorting by object key with fallback sort</caption>
 * objArr.sort((a, b) => alphabeticalSortCurried()(a.key, b.key) || alphabeticalSortCurried()(a.key2, b.key2))
 */

export const alphabeticalSortCurried =
  <T>(descending = false, hoist?: T) =>
  (a: T, b: T) => {
    if (hoist && (a === hoist || b === hoist) && a !== b) {
      return a === hoist ? -1 : 1;
    }
    const x = typeof a === "string" ? a.toLowerCase() : a;
    const y = typeof b === "string" ? b.toLowerCase() : b;
    if (x < y) {
      return descending ? 1 : -1;
    }
    if (x > y) {
      return descending ? -1 : 1;
    }
    if (typeof a === "string" && typeof b === "string") {
      return descending ? b.localeCompare(a) : a.localeCompare(b);
    }
    return 0;
  };

/**
 * Sorts an array of strings in alphabetical order. *MUTATES*
 * @param array Array of strings to be sorted.
 * @param descending Whether to sort the `array` in descending order. Defaults to false.
 * @param hoist Value to be hoisted to beginning of array.
 * @returns `array` sorted alphabetically in ascending or descending order, with hoisted value at the beginning if provided.
 */

export const alphabeticalSort = (array: string[], descending = false, hoist?: string) =>
  array.sort(alphabeticalSortCurried(descending, hoist));

/**
 * Creates a function to pass to sort an array of objects by a specified prop, in alphabetical order.
 * @param prop Property to sort objects by.
 * @param descending Whether to sort the `array` in descending order. Defaults to false.
 * @param hoist Value to be hoisted to beginning of `array`.
 * @returns Function to pass `a` and `b` objects to.
 * @example <caption>Sorting by object key</caption>
 * arr.sort(alphabeticalSortProp("key"))
 * @example <caption>Sorting by object key with fallback sort</caption>
 * arr.sort((a,b) => alphabeticalSortProp("key")(a,b) || alphabeticalSortProp("key2")(a,b))
 */

export const alphabeticalSortPropCurried =
  <O extends Record<string, unknown>, K extends keyof O = keyof O>(prop: K, descending = false, hoist?: O[K]) =>
  (a: O, b: O) =>
    alphabeticalSortCurried(descending, hoist)(a[prop], b[prop]);

/**
 * Sorts an array of objects by a specified prop, in alphabetical order. *MUTATES*
 * @param array Array of identical objects.
 * @param prop Property to sort objects by.
 * @param descending Whether to sort the `array` in descending order. Defaults to false.
 * @param hoist Value to be hoisted to beginning of `array`.
 * @returns `array` sorted by provided prop, with hoisted value at the beginning if provided.
 */

export const alphabeticalSortProp = <O extends Record<string, unknown>, K extends keyof O = keyof O>(
  array: O[],
  prop: K,
  descending = false,
  hoist?: O[K]
) => array.sort(alphabeticalSortPropCurried(prop, descending, hoist));

/**
 * Delays for specified amount of milliseconds, then returns a promise.
 * Taken from https://stackoverflow.com/a/39538518
 * @param t Milliseconds to delay.
 * @param v Optional value to resolve with.
 * @returns Resolved promise with `v` if provided.
 */

export const delay: {
  (t: number): Promise<undefined>;
  <T>(t: number, v: T): Promise<T>;
  <T>(t: number, v?: T): Promise<T | undefined>;
} = <T>(t: number, v?: T): Promise<T | undefined> =>
  new Promise<T | undefined>(function (resolve) {
    setTimeout(() => resolve(v), t);
  });

/**
 * Converts JSX to RMWC icon object parameter.
 * @param jsx JSX of icon component.
 * @returns Object with `strategy` set to `"component"` and `icon` set to the value of `jsx`.
 */

export const iconObject = (jsx: React.ReactNode, config?: Omit<IconOptions, "icon">): IconPropT => {
  return {
    strategy: "component",
    icon: jsx,
    ...config,
  };
};

/**
 * Adds scroll-lock class to body, to prevent scrolling while modal is open.
 */

export const openModal = (id = nanoid()) => {
  document.body.classList.add(`scroll-lock-${id}`);
  return id;
};

/**
 * Removes scroll-lock class from body, to allow scrolling once modal is closed.
 */

export const closeModal = (id: string) => {
  document.body.classList.remove(`scroll-lock-${id}`);
};
