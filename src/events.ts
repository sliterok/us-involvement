import data from "./data.json";
import { toYear } from "./helpers";
import { ICountryEvent } from "./types";

export const events = (data as ICountryEvent[]).sort(
  (a, b) => toYear(a.years) - toYear(b.years)
);
