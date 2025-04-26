import data from "./data.json";
import { ICountryEvent } from "./types";

export const events = (data as ICountryEvent[]).sort(
  (a, b) => parseInt(b.years) - parseInt(a.years)
);
