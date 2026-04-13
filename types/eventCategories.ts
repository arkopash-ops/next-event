export const EVENT_CATEGORIES = [
  "MOVIE",
  "COMEDY",
  "SPORTS",
  "WORKSHOP",
  "PLAY",
  "ACTIVITY",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
