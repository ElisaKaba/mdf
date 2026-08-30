import { houses } from "@/data/houses";

export function getHouseBySlug(slug: string) {
  return houses.find((house) => house.slug === slug);
}