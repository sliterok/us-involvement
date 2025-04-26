import { PickingInfo } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { Feature } from "geojson";
import { useEffect, useRef, useState } from "react";
import i18n from "../i18n";
import { greenRedMix } from "../helpers";
import { ITooltipHandle, Tooltip } from "./Tooltip";
import { useEvents, useGeoJson, useTranslations } from "../hooks/fetchers";
import Loader from "./Loader";

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 20,
  zoom: 1.5,
  minZoom: 1,
  maxZoom: 8,
  pitch: 0,
  bearing: 0,
};

export default function InfiltrationMap() {
  const tooltipRef = useRef<ITooltipHandle>(null);
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem("userLanguage") || i18n.language;
  });
  const { geoJson, isLoadingGeoJson, errorGeoJson } = useGeoJson();
  const { events, isLoadingEvents, errorEvents } = useEvents();
  const { translations, isLoadingTranslations } = useTranslations();

  useEffect(() => {
    if (translations) {
      i18n.addResourceBundle(language, "translation", translations, true, true);

      if (i18n.language !== language) {
        i18n.changeLanguage(language);
      }
    }
  }, [language, translations]);

  const changeLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("userLanguage", lang);
    i18n.changeLanguage(lang);
  };

  if (isLoadingGeoJson || isLoadingEvents || isLoadingTranslations)
    return <Loader />;

  if (errorGeoJson)
    return (
      <div className="error-message">
        Error loading geographical data: {errorGeoJson.message}
      </div>
    );
  if (errorEvents)
    return (
      <div className="error-message">
        Error loading events data: {errorEvents.message}
      </div>
    );
  if (!events || !geoJson)
    return (
      <div className="error-message">
        Error: Missing required map data. Please try refreshing.
      </div>
    );

  const layer =
    geoJson &&
    new GeoJsonLayer({
      id: "geojson-layer",
      data: geoJson,
      filled: true,
      stroked: true,
      getFillColor: (d: Feature): [number, number, number, number] => {
        const countryName = d.properties?.name;
        if (!countryName) return [200, 200, 200, 50];

        const countryEvents = events.filter((c) =>
          c.countries.includes(countryName)
        );

        if (countryEvents.length) {
          const successfulEvents = countryEvents.filter((e) => e.success);
          const score = successfulEvents.length / countryEvents.length;
          const baseColor = greenRedMix(score);
          return [...baseColor, 200] as [number, number, number, number];
        }

        return [200, 200, 200, 50];
      },

      getLineColor: [80, 80, 80, 200],
      getLineWidth: 10000,
      lineWidthMaxPixels: 2,
      lineWidthUnits: "meters",
      pickable: true,
      autoHighlight: true,
      onHover: (info: PickingInfo) => {
        const { object, x, y } = info;
        const countryName = object?.properties?.name;
        const tooltip = tooltipRef.current;
        if (!tooltip) return;

        tooltip.set(countryName);
        if (countryName) tooltip.move(x, y);
      },
    });

  return (
    <>
      <div className="language-selector emoji">
        <button
          onClick={() => changeLanguage("en")}
          className={language === "en" ? "active" : ""}
          aria-label="Switch to English"
        >
          🇺🇸
        </button>
        <button
          onClick={() => changeLanguage("ru")}
          className={language === "ru" ? "active" : ""}
          aria-label="Switch to Russian"
        >
          🇷🇺
        </button>
      </div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer]}
      />
      <Tooltip ref={tooltipRef} />
    </>
  );
}
