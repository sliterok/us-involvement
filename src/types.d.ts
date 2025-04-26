import { EventType } from "./eventType";

export interface ICountryEvent {
  years: string;
  type: EventType;
  success: boolean;
  summary: string;
  title: string;
  countries: string[];
}
