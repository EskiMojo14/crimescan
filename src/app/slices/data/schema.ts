import { Query } from "@s/data/types";
import { schemaForType } from "@s/util/schema";
import { z } from "zod";

export const yearRegex = /^\d{4}$/;
export const monthRegex = /^\d{4}-(0[1-9]|1[012])$/;
export const latLngRegex = /^(-?\d+(\.\d+)?)$/;

export const dateSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("month"), date: z.string().regex(monthRegex) }),
  z.object({ type: z.literal("year"), date: z.string().regex(yearRegex) }),
]);

export const latLngSchema = z.object({
  lat: z.string().regex(latLngRegex),
  lng: z.string().regex(latLngRegex),
});

export const querySchema = schemaForType<Query>()(z.intersection(dateSchema, latLngSchema));
