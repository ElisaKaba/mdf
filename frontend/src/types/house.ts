export type House = {
  id: string;
  slug: string;

  name: string;
  city: string;

  address?: string;
  email?: string;
  phone?: string;

  logo?: string;
  heroImage?: string;

  facebookUrl?: string;
  instagramUrl?: string;
  donationUrl?: string;

  locales: string[];
  defaultLocale: string;
};