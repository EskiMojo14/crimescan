import { nanoid } from "@reduxjs/toolkit";
import type { IconOptions, IconPropT } from "@rmwc/types";
import type { ObjectEntries } from "@s/util/types";
import debounce from "lodash.debounce";

/**
 * Checks that object contains specified key.
 * @param obj Object to be checked.
 * @param key Key to check against `obj`.
 * @returns Whether `obj` has the specified `key`.
 */

export const hasKey = <O>(obj: O, key: keyof any): key is keyof O => key in obj;

/**
 * Checks if item is included in array, and asserts that the types are the same.
 * @param arr Array of items
 * @param item Item to be checked
 * @returns Whether the item is contained in the array.
 */

export const arrayIncludes = <T>(arr: Readonly<T[]> | T[], item: any): item is T => arr.includes(item);

/**
 * Checks every item of an array matches a condition, and asserts that the items are a specified type.
 * @param arr Array of items to be checked
 * @param callback Type predicate which takes each item and checks its type, returning `true` if the type matches.
 * @returns If all items meet the callback requirement.
 */

export const arrayEveryType = <T>(
  arr: any[],
  predicate: (item: any, index: number, array: any[]) => item is T
): arr is T[] => arr.every(predicate);

/** Merge objects and modify specified keys. */

export const mergeObjects = <T>(obj: T, ...objs: Partial<T>[]): T => Object.assign({}, obj, ...objs);

/**
 * Returns an array of object keys to iterate on.
 *
 * Only use for objects you're certain won't gain more keys in runtime.
 */

export const objectKeys = <T extends Record<string, any>>(obj: T): (keyof T)[] => Object.keys(obj);

/**
 * Returns an array of object entries to iterate on.
 *
 * Only use for objects you're certain won't gain more keys in runtime.
 */

export const objectEntries = <T extends Record<string, any>>(obj: T): ObjectEntries<T> => Object.entries(obj);

/**
 * Creates an object from tuples. Use to assert a
 */

export const objectFromEntries = <T extends Record<string, any>>(entries: ObjectEntries<T>): T =>
  Object.fromEntries(entries) as T;

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

export const iconObject = (jsx: React.ReactNode, config?: Omit<IconOptions, "icon">): IconPropT => ({
  icon: jsx,
  strategy: "component",
  ...config,
});

/**
 * Adds scroll-lock class to body, to prevent scrolling while modal is open.
 * @param [id] id to namespace class with (uses nanoid by default)
 * @returns id used to namespace
 */

export const openModal = (id = nanoid()) => {
  document.body.classList.add(`scroll-lock-${id}`);
  return id;
};

/**
 * Removes scroll-lock class from body, to allow scrolling once modal is closed.
 * @param id id used when namespacing class
 */

export const closeModal = (id: string) => {
  document.body.classList.remove(`scroll-lock-${id}`);
};

/**
 * Takes an array of functions that create promises, and awaits them in series, returning the results as an array.
 * @param promises array of functions that create promises
 * @param [delayTime] time to wait between each function
 * @returns array of results from awaiting promises
 */

export const promiseAllSeries = async <T>(
  promises: (() => PromiseLike<T> | T)[],
  delayTime?: number
): Promise<Awaited<T>[]> => {
  const values: any[] = [];
  for (const promise of promises) {
    values.push(await promise());
    if (delayTime) {
      await delay(delayTime);
    }
  }
  return values as any;
};

/**
 * Debounces an asynchronous function
 * @param func function to debounce
 * @param wait time to wait
 * @returns debounced wrapper for async function
 */

export function asyncDebounce<F extends (...args: any[]) => Promise<any>>(func: F, wait?: number) {
  const resolveSet = new Set<(p: any) => void>();
  const rejectSet = new Set<(p: any) => void>();

  const debounced = debounce((args: Parameters<F>) => {
    func(...args)
      .then((...res) => {
        resolveSet.forEach((resolve) => resolve(...res));
        resolveSet.clear();
      })
      .catch((...res) => {
        rejectSet.forEach((reject) => reject(...res));
        rejectSet.clear();
      });
  }, wait);

  return (...args: Parameters<F>): ReturnType<F> =>
    new Promise((resolve, reject) => {
      resolveSet.add(resolve);
      rejectSet.add(reject);
      debounced(args);
    }) as ReturnType<F>;
}
