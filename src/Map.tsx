import { PickingInfo } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { Feature, FeatureCollection } from "geojson";
import { useEffect, useState, useRef } from "react";
import { greenRedMix } from "./helpers";
import { events } from "./events";
import { ITooltipHandle, Tooltip } from "./Tooltip";

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
  const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
  const tooltipRef = useRef<ITooltipHandle>(null);

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

        const countryEvents = events.filter((c) =>
          c.countries.includes(countryName)
        );

        if (countryEvents.length) {
          const successfulEvents = countryEvents.filter(
            (e) => e.success
          ).length;
          const score = successfulEvents / countryEvents.length;
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
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer]}
      />
      <Tooltip ref={tooltipRef} />
    </>
  );
}
