import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/server";

const subjectSchema = z.enum([
  "volunteer",
  "workshop",
  "help",
  "other",
]);

const contactSchema = z
  .object({
    houseSlug: z
      .string()
      .min(1, "La Maison des Femmes est introuvable."),

    firstName: z
      .string()
      .trim()
      .min(2, "Le prénom doit contenir au moins 2 caractères.")
      .max(80, "Le prénom est trop long."),

    lastName: z
      .string()
      .trim()
      .min(2, "Le nom doit contenir au moins 2 caractères.")
      .max(80, "Le nom est trop long."),

    email: z
      .string()
      .trim()
      .min(1, "L’adresse e-mail est obligatoire.")
      .email("Saisissez une adresse e-mail valide."),

    subject: subjectSchema,

    subjectDetails: z
      .string()
      .trim()
      .max(150, "La précision du sujet est trop longue.")
      .optional(),

    message: z
      .string()
      .trim()
      .min(10, "Le message doit contenir au moins 10 caractères.")
      .max(2000, "Le message ne peut pas dépasser 2000 caractères."),

    consent: z.literal(true, {
      error:
        "Vous devez accepter l’utilisation de vos données pour envoyer votre message.",
    }),
  })
  .superRefine((data, ctx) => {
    if (
      data.subject === "other" &&
      !data.subjectDetails?.trim()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["subjectDetails"],
        message: "Précisez votre demande.",
      });
    }
  });

function getSubjectLabel(
  subject: z.infer<typeof subjectSchema>,
  subjectDetails?: string
) {
  switch (subject) {
    case "volunteer":
      return "Devenir bénévole";

    case "workshop":
      return "Proposer un atelier";

    case "help":
      return "Besoin d’aide";

    case "other":
      return subjectDetails?.trim()
        ? `Autre : ${subjectDetails.trim()}`
        : "Autre";
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result =
      contactSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<
        string,
        string
      > = {};

      for (const issue of result.error.issues) {
        const field =
          issue.path[0];

        if (
          typeof field === "string" &&
          !fieldErrors[field]
        ) {
          fieldErrors[field] =
            issue.message;
        }
      }

      return NextResponse.json(
        {
          success: false,
          type: "validation",
          fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const contact =
      result.data;

    const subjectLabel =
      getSubjectLabel(
        contact.subject,
        contact.subjectDetails
      );

    const { error } =
      await supabaseAdmin
        .from("contact_messages")
        .insert({
          house_slug:
            contact.houseSlug,

          first_name:
            contact.firstName,

          last_name:
            contact.lastName,

          email:
            contact.email,

          subject:
            subjectLabel,

          message:
            contact.message,

          consent:
            contact.consent,

          status:
            "new",
        });

    if (error) {
      console.error(
        "SUPABASE CONTACT ERROR :",
        error
      );

      return NextResponse.json(
        {
          success: false,
          type: "server",
          message:
            "Votre message n’a pas pu être enregistré. Réessayez dans quelques instants.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Votre message a bien été envoyé. La Maison des Femmes pourra revenir vers vous.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CONTACT ERROR :",
      error
    );

    return NextResponse.json(
      {
        success: false,
        type: "server",
        message:
          "Une erreur inattendue est survenue. Réessayez dans quelques instants.",
      },
      {
        status: 500,
      }
    );
  }
}