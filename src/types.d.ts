export enum EventType {
  "Coup" = "Coup",
  "Election Interference" = "Election Interference",
  "Invasion / Occupation" = "Invasion / Occupation",
  "Proxy-War / Armed Support" = "Proxy-War / Armed Support",
  "Assassination" = "Assassination",
  "Political Pressure / Sanctions" = "Political Pressure / Sanctions",
}

export interface ICountryEvent {
  years: string;
  type: EventType;
  success: boolean;
  summary: string;
  title: string;
  countries: string[];
}
