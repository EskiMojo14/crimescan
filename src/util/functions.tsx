import { IconOptions, IconPropT } from "@rmwc/types";

/**
 * Checks that object contains specified key.
 * @param obj Object to be checked.
 * @param key Key to check against `obj`.
 * @returns Whether `obj` has the specified `key`.
 */

export function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj;
}

/**
 * Remove all duplicate values within an array.
 * @param array Array of values.
 * @returns `array` with only unique values.
 */

export function uniqueArray<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Counts occurrences of specified value within provided array.
 * @param arr Array to be checked.
 * @param val Value to be counted.
 * @returns Amount of items within `arr` equal to `val`.
 */

export function countInArray<T>(arr: T[], val: T): number {
  return arr.reduce((count, item) => count + (item === val ? 1 : 0), 0);
}

/**
 * Sorts an array of strings in alphabetical order.
 * @param array Array of strings to be sorted.
 * @param descending Whether to sort the `array` in descending order. Defaults to false.
 * @returns `array` sorted alphabetically in ascending or descending order.
 */

export function alphabeticalSort(array: string[], descending = false) {
  array.sort((a, b) => {
    const x = a.toLowerCase();
    const y = b.toLowerCase();
    if (x < y) {
      return descending ? 1 : -1;
    }
    if (x > y) {
      return descending ? -1 : 1;
    }
    return 0;
  });
  return array;
}

/**
 * Sorts an array of objects by a specified prop, in alphabetical order.
 * @param array Array of identical objects.
 * @param prop Property to sort objects by.
 * @param descending Whether to sort the `array` in descending order. Defaults to false.
 * @param hoist Value to be hoisted to beginning of `array`.
 * @returns `array` sorted by provided prop, with hoisted value at the beginning if provided.
 */

export function alphabeticalSortProp<O extends Record<string, unknown>>(
  array: O[],
  prop: keyof O,
  descending = false,
  hoist?: O[keyof O]
) {
  array.sort((a, b) => {
    const x = a[prop];
    const y = b[prop];
    if (hoist && (x === hoist || y === hoist)) {
      return x === hoist ? -1 : 1;
    }
    const c = typeof x === "string" ? x.toLowerCase() : x;
    const d = typeof y === "string" ? y.toLowerCase() : y;
    if (c < d) {
      return descending ? 1 : -1;
    }
    if (c > d) {
      return descending ? -1 : 1;
    }
    return 0;
  });
  return array;
}

/**
 * Delays for specified amount of milliseconds, then returns a promise.
 * Taken from https://stackoverflow.com/a/39538518
 * @param t Milliseconds to delay.
 * @param v Optional value to resolve with.
 * @returns Resolved promise with `v` if provided.
 */

export function delay(t: number, v?: any) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

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
