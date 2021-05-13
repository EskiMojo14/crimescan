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
