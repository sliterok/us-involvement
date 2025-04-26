export type IEventType =
  | "Coup"
  | "Election Interference"
  | "Invasion / Occupation"
  | "Proxy-War / Armed Support"
  | "Assassination"
  | "Political Pressure / Sanctions";

export interface ICountryEvent {
  years: string;
  type: IEventType;
  success: boolean;
  summary: string;
  title: string;
  countries: string[];
}
