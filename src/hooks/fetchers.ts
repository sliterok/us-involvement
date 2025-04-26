import useSWR from "swr";
import { ICountryEvent } from "../types";
import { FeatureCollection } from "geojson";

const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

export function useEvents(language = "en") {
  const {
    data: events,
    isLoading: isLoadingEvents,
    error: errorEvents,
  } = useSWR<ICountryEvent[]>(`data.${language}.json`, fetcher);

  return {
    events,
    isLoadingEvents,
    errorEvents,
  };
}

export function useGeoJson() {
  const {
    data: geoJson,
    isLoading: isLoadingGeoJson,
    error: errorGeoJson,
  } = useSWR<FeatureCollection>(
    `https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson`,
    fetcher
  );

  return { geoJson, isLoadingGeoJson, errorGeoJson };
}
