const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

export async function fetchStrapi<T>(
  endpoint: string,
  query = ""
): Promise<T> {
  const response = await fetch(
    `${STRAPI_URL}/api/${endpoint}${query}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Erreur Strapi : ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}