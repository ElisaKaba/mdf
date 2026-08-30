export type EventCategory =
  | "atelier"
  | "permanence"
  | "evenement";

export type Event = {
  id: string;
  title: string;
  date: string;
  category: EventCategory;
  location?: string;
};