import {
  memo,
  forwardRef,
  useState,
  useImperativeHandle,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { events } from "./events";
import "./Tooltip.css";

export interface ITooltipHandle {
  set(countryName?: string): void;
  move(x: number, y: number): void;
}

export const Tooltip = memo(
  forwardRef<ITooltipHandle>((_, ref) => {
    const [tooltipCountry, setTooltipCountry] = useState<string>();
    const tooltipRef = useRef<HTMLDivElement>(null);

    const moveTooltip = useCallback((x: number, y: number) => {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      tooltip.style.top = `${y}px`;
      tooltip.style.left = `${x}px`;
    }, []);

    useImperativeHandle(ref, () => ({
      set: setTooltipCountry,
      move: moveTooltip,
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
        className="tooltip"
        ref={tooltipRef}
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
