import { PickingInfo } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { Feature, FeatureCollection } from "geojson";
import { useEffect, useState } from "react";
import data from "./data.json";
import "./App.css";

const infiltrationData = data as ICountryData[];

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 20,
  zoom: 1.5,
  minZoom: 1,
  maxZoom: 8,
  pitch: 0,
  bearing: 0,
};

type IEventType =
  | "Coup"
  | "Election Interference"
  | "Invasion / Occupation"
  | "Proxy-War / Armed Support"
  | "Assassination"
  | "Political Pressure / Sanctions";

interface CountryEvent {
  years: string;
  type: IEventType;
  success: boolean;
  summary: string;
}

interface ICountryData {
  country: string;
  events: CountryEvent[];
}

const outcomeColors = [
  [255, 0, 0],
  [0, 255, 0],
];

export default function USInfiltrationMap() {
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    )
      .then((res) => res.json())
      .then((data) => setGeoJson(data));
  }, []);

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

        const match = infiltrationData.find(
          (c) => c.country.toLowerCase() === countryName.toLowerCase()
        );

        if (match && match.events.length > 0) {
          const succeededOnce = Math.max(
            ...match.events.map((e) => +e.success)
          );
          const baseColor = outcomeColors[+succeededOnce];
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
        const tooltip = document.getElementById("tooltip");

        if (tooltip && countryName) {
          const country = infiltrationData.find(
            (c) => c.country.toLowerCase() === countryName.toLowerCase()
          );

          if (country) {
            tooltip.style.top = `${y}px`;
            tooltip.style.left = `${x}px`;

            let tooltipContent = `<strong>${country.country}</strong>`;
            country.events.forEach((event: CountryEvent) => {
              tooltipContent += `<hr>${event.success ? "✅" : "❌"} ${
                event.years
              }, ${event.type}<br>${event.summary}`;
            });
            tooltip.innerHTML = tooltipContent;
            tooltip.style.display = "block";
          } else {
            tooltip.style.display = "none";
          }
        } else if (tooltip) {
          tooltip.style.display = "none";
        }
      },
    });

  return (
    <div style={{ position: "relative", height: "100lvh", width: "100lvw" }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer]}
      />
      <div
        id="tooltip"
        style={{
          display: "none",
        }}
      />
    </div>
  );
}
