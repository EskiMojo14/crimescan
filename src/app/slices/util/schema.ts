import type { ZodType } from "zod";

export const schemaForType =
  <T>() =>
  <S extends ZodType<T>>(arg: S) =>
    arg;
