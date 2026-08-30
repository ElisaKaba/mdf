export type EventCategory =
  | "atelier"
  | "permanence"
  | "evenement";

export type PricingType =
  | "free"
  | "fixed"
  | "pay_what_you_want";

export type Event = {
  id: string;
  slug: string;

  title: string;
  summary?: string;
  description?: string;

  category: EventCategory;

  startDate: string;

  startTime?: string;
  endTime?: string;

  location?: string;

  registrationRequired?: boolean;
  registrationDeadline?: string;

  capacity?: number;

  pricingType?: PricingType;
  price?: number;

  houseSlug: string;

  imageUrl?: string;
};