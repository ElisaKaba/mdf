import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/server";

const registrationSchema = z.object({
  eventId: z
    .string()
    .min(1, "L’événement est introuvable."),

  eventTitle: z
    .string()
    .min(1, "Le titre de l’événement est manquant."),

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

  phone: z
    .string()
    .trim()
    .max(30, "Le numéro de téléphone est trop long.")
    .optional(),

  participants: z
    .number()
    .int("Le nombre de participantes doit être un nombre entier.")
    .min(1, "Il faut au moins 1 participante.")
    .max(10, "Vous pouvez inscrire au maximum 10 participantes."),

  message: z
    .string()
    .trim()
    .max(1000, "Le message ne peut pas dépasser 1000 caractères.")
    .optional(),

  consent: z.literal(true, {
    error:
      "Vous devez accepter l’utilisation de vos données pour vous inscrire.",
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registrationSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (
          typeof field === "string" &&
          !fieldErrors[field]
        ) {
          fieldErrors[field] = issue.message;
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

    const registration = result.data;

    /*
     * Récupération de l'événement directement depuis Strapi.
     * On ne fait pas confiance aux données métier envoyées
     * par le navigateur.
     */
    const strapiUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL ??
      "http://localhost:1337";

    const eventResponse = await fetch(
      `${strapiUrl}/api/events?filters[documentId][$eq]=${registration.eventId}&populate=house`,
      {
        cache: "no-store",
      }
    );

    if (!eventResponse.ok) {
      console.error(
        "STRAPI EVENT ERROR :",
        eventResponse.status,
        eventResponse.statusText
      );

      return NextResponse.json(
        {
          success: false,
          type: "server",
          message:
            "Impossible de récupérer les informations de l’activité.",
        },
        {
          status: 500,
        }
      );
    }

    const eventData = await eventResponse.json();

    const strapiEvent = eventData.data?.[0];

    if (!strapiEvent) {
      return NextResponse.json(
        {
          success: false,
          type: "not_found",
          message:
            "Cette activité est introuvable.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Vérification de la maison.
     */
    if (
      strapiEvent.house?.slug !==
      registration.houseSlug
    ) {
      return NextResponse.json(
        {
          success: false,
          type: "invalid_house",
          message:
            "Cette activité ne correspond pas à la Maison des Femmes sélectionnée.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Vérification de la date limite d'inscription.
     */
    if (strapiEvent.registrationDeadline) {
      const deadline = new Date(
        strapiEvent.registrationDeadline
      );

      const now = new Date();

      if (now > deadline) {
        return NextResponse.json(
          {
            success: false,
            type: "registration_closed",
            message:
              "Les inscriptions à cette activité sont maintenant closes.",
          },
          {
            status: 409,
          }
        );
      }
    }

    /*
     * Vérification de la capacité.
     */
    const capacity: number | undefined =
      strapiEvent.capacity;

    if (capacity) {
      const {
        data: existingRegistrations,
        error: countError,
      } = await supabaseAdmin
        .from("event_registrations")
        .select("participants")
        .eq(
          "event_id",
          registration.eventId
        )
        .in(
          "status",
          ["pending", "confirmed"]
        );

      if (countError) {
        console.error(
          "SUPABASE COUNT ERROR :",
          countError
        );

        return NextResponse.json(
          {
            success: false,
            type: "server",
            message:
              "Impossible de vérifier les places disponibles pour le moment.",
          },
          {
            status: 500,
          }
        );
      }

      const registeredParticipants =
        existingRegistrations?.reduce(
          (total, item) =>
            total + item.participants,
          0
        ) ?? 0;

      const remainingPlaces =
        capacity - registeredParticipants;

      if (
        registration.participants >
        remainingPlaces
      ) {
        return NextResponse.json(
          {
            success: false,
            type: "capacity",
            message:
              remainingPlaces <= 0
                ? "Cette activité est complète."
                : `Il ne reste que ${remainingPlaces} place${
                    remainingPlaces > 1
                      ? "s"
                      : ""
                  } disponible${
                    remainingPlaces > 1
                      ? "s"
                      : ""
                  }.`,
          },
          {
            status: 409,
          }
        );
      }
    }

    /*
     * Enregistrement dans Supabase.
     */
    const { error } = await supabaseAdmin
      .from("event_registrations")
      .insert({
        house_slug:
          registration.houseSlug,

        event_id:
          registration.eventId,

        event_title:
          registration.eventTitle,

        first_name:
          registration.firstName,

        last_name:
          registration.lastName,

        email:
          registration.email,

        phone:
          registration.phone ?? null,

        participants:
          registration.participants,

        message:
          registration.message ?? null,

        consent:
          registration.consent,

        status:
          "pending",
      });

    if (error) {
      console.error(
        "SUPABASE ERROR :",
        error
      );

      /*
       * PostgreSQL code 23505 =
       * violation d'une contrainte UNIQUE.
       */
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            type: "validation",
            fieldErrors: {
              email:
                "Cette adresse e-mail est déjà inscrite à cette activité.",
            },
          },
          {
            status: 409,
          }
        );
      }

      return NextResponse.json(
        {
          success: false,
          type: "server",
          message:
            "L’inscription n’a pas pu être enregistrée. Réessayez dans quelques instants.",
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
          "Votre inscription a bien été enregistrée.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "REGISTRATION ERROR :",
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