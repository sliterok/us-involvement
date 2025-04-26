import { PickingInfo } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import { Feature } from "geojson";
import { useRef } from "react";
import { greenRedMix } from "./helpers";
import { ITooltipHandle, Tooltip } from "./Tooltip";
import { useEvents, useGeoJson } from "./hooks/fetchers";

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

  const { geoJson, isLoadingGeoJson, errorGeoJson } = useGeoJson();
  const { events, isLoadingEvents, errorEvents } = useEvents();

  if (isLoadingGeoJson || isLoadingEvents) return <div>loading...</div>;
  if (!events || !geoJson) return <div>error loading events or geojson</div>;

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
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[layer]}
      />
      <Tooltip ref={tooltipRef} />
    </>
  );
}
