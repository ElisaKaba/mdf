import ContactForm from "@/components/contact/ContactForm";

type ContactPageProps = {
  params: Promise<{
    houseSlug: string;
  }>;
};

export default async function ContactPage({
  params,
}: ContactPageProps) {
  const { houseSlug } = await params;

  return (
    <ContactForm
      houseSlug={houseSlug}
    />
  );
}