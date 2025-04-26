import {
  memo,
  forwardRef,
  useState,
  useImperativeHandle,
  useMemo,
} from "react";
import { events } from "./events";
import "./Tooltip.css";

export interface ITooltipHandle {
  set(countryName?: string): void;
}

export const Tooltip = memo(
  forwardRef<ITooltipHandle>((_, ref) => {
    const [tooltipCountry, setTooltipCountry] = useState<string>();

    useImperativeHandle(ref, () => ({
      set: setTooltipCountry,
    }));

    const tooltipEvents = useMemo(
      () =>
        tooltipCountry
          ? events.filter((c) => c.countries.includes(tooltipCountry))
          : [],
      [tooltipCountry]
    );
    return (
      <div
        id="tooltip"
        style={{
          display: tooltipEvents.length ? "block" : "none",
        }}
      >
        <strong>{tooltipCountry}</strong>
        {tooltipEvents.map((event, i) => (
          <div key={i}>
            <hr />
            <strong>{event.title}</strong>
            {event.success ? "✅" : "❌"} {event.years} {event.type}
            <br />
            {event.summary}
          </div>
        ))}
      </div>
    );
  })
);
