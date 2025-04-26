import {
  memo,
  forwardRef,
  useState,
  useImperativeHandle,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import "./Tooltip.css";
import { EventType } from "../types";
import { useEvents } from "../hooks/fetchers";

export interface ITooltipHandle {
  set(countryName?: string): void;
  move(x: number, y: number): void;
}

const eventTypeEmoji: Record<EventType, string> = {
  Coup: "⚔️",
  "Election Interference": "🗳️⚠️",
  "Invasion / Occupation": "🪖",
  "Proxy-War / Armed Support": "🤝🪖",
  Assassination: "🗡️",
  "Political Pressure / Sanctions": "💰🚫",
} as const;

export const Tooltip = memo(
  forwardRef<ITooltipHandle>((_, ref) => {
    const { t } = useTranslation();
    const [tooltipCountry, setTooltipCountry] = useState<string>();
    const tooltipRef = useRef<HTMLDivElement>(null);
    const { events } = useEvents();

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
          ? events?.filter((c) => c.countries.includes(tooltipCountry)) || []
          : [],
      [tooltipCountry, events]
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
            <div className="event-info">
              <div>
                {event.success ? "✅" : "❌"} {event.years}
              </div>
              <div>
                {eventTypeEmoji[event.type]} {t(event.type)}
              </div>
            </div>

            {event.summary}
          </div>
        ))}
      </div>
    );
  })
);
