import Hero from "@/components/home/Hero";
import { getHouses } from "@/lib/strapi/houses";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const response = await getHouses("fr");

  return (
    <Hero
      houses={response.data ?? []}
    />
  );
}