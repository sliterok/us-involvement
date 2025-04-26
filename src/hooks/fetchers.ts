import useSWR from "swr";
import i18n from "../i18n"; // Import i18n instance
import { ICountryEvent } from "../types";
import { FeatureCollection } from "geojson";

const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

export function useEvents() {
  const language = i18n.language;
  const {
    data,
    isLoading: isLoadingEvents,
    error: errorEvents,
  } = useSWR<ICountryEvent[]>(`${language}/data.json`, fetcher, {
    revalidateOnMount: true,
  });

  const events = data?.sort((a, b) => parseInt(b.years) - parseInt(a.years));

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

export function useTranslations() {
  const language = i18n.language;
  const { data: translations, isLoading: isLoadingTranslations } = useSWR<
    Record<string, string>
  >(`${language}/translations.json`, fetcher, {
    revalidateOnMount: true,
  });

  return { translations, isLoadingTranslations };
}
