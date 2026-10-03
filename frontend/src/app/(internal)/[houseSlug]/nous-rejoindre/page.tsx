import { headers } from "next/headers";
import { resolveLocale } from "@/lib/i18n/getDefaultLocale";
import { redirect } from "next/navigation";

type OldJoinPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
  params: Promise<{
    houseSlug: string;
  }>;
};

export default async function OldJoinPage({
  params,
  searchParams,
}: OldJoinPageProps) {
  const { houseSlug } = await params;

  const locale = resolveLocale((await headers()).get("host"), (await searchParams).lang);
  redirect(`/${houseSlug}/nous-soutenir?lang=${locale}`);
}