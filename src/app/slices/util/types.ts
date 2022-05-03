import React from "react";

/** Alias for standard HTML props. */

export type HTMLProps = React.HTMLAttributes<HTMLElement>;

/** An array of [key, value] tuples */
export type ObjectEntries<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: [Key, Obj[Key]];
}[keyof Obj][];
