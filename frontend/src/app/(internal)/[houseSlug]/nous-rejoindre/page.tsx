import { redirect } from "next/navigation";

type OldJoinPageProps = {
  params: Promise<{
    houseSlug: string;
  }>;
};

export default async function OldJoinPage({
  params,
}: OldJoinPageProps) {
  const { houseSlug } = await params;

  redirect(`/${houseSlug}/nous-soutenir`);
}