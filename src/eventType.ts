export enum EventType {
  coup = "coup",
  elint = "elint",
  inv = "inv",
  proxy = "proxy",
  assass = "assass",
  sanct = "sanct",
}

export const eventTypeEmoji: Record<EventType, string> = {
  coup: "⚔️",
  elint: "🗳️⚠️",
  inv: "🪖",
  proxy: "🤝🪖",
  assass: "🗡️",
  sanct: "💰🚫",
} as const;
