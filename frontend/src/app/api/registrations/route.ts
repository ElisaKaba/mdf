import { NextResponse } from "next/server";
import { localizeFormResponse } from "@/lib/i18n/formResponse";
import { z } from "zod";

import { appDb } from "@/lib/db/appDb";

const registrationSchema = z.object({
  eventId: z
    .string()
    .min(
      1,
      "L’événement est introuvable."
    ),

  eventTitle: z
    .string()
    .min(
      1,
      "Le titre de l’événement est manquant."
    ),

  houseSlug: z
    .string()
    .min(
      1,
      "La Maison des Femmes est introuvable."
    ),

  firstName: z
    .string()
    .trim()
    .min(
      2,
      "Le prénom doit contenir au moins 2 caractères."
    )
    .max(
      80,
      "Le prénom est trop long."
    ),

  lastName: z
    .string()
    .trim()
    .min(
      2,
      "Le nom doit contenir au moins 2 caractères."
    )
    .max(
      80,
      "Le nom est trop long."
    ),

  email: z
    .string()
    .trim()
    .min(
      1,
      "L’adresse e-mail est obligatoire."
    )
    .email(
      "Saisissez une adresse e-mail valide."
    ),

  phone: z
    .string()
    .trim()
    .max(
      30,
      "Le numéro de téléphone est trop long."
    )
    .optional(),

  participants: z
    .number()
    .int(
      "Le nombre de participantes doit être un nombre entier."
    )
    .min(
      1,
      "Il faut au moins 1 participante."
    ),

  message: z
    .string()
    .trim()
    .max(
      1000,
      "Le message ne peut pas dépasser 1000 caractères."
    )
    .optional(),

  consent: z
    .boolean()
    .optional(),
});

function escapeHtml(
  value: string | null | undefined
) {
  return (value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatEventDate(
  value: string | null | undefined,
  locale: "fr" | "eu"
) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return new Intl.DateTimeFormat(
    locale === "eu"
      ? "eu-ES"
      : "fr-FR",
    {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Europe/Paris",
    }
  ).format(date);
}

export async function POST(
  request: Request
) {
  const locale =
    request.headers.get(
      "x-mdf-locale"
    ) === "eu"
      ? "eu"
      : "fr";

  const respond = (
    body: Parameters<
      typeof localizeFormResponse
    >[0],
    init?: ResponseInit
  ) =>
    NextResponse.json(
      localizeFormResponse(
        body,
        locale
      ),
      init
    );

  try {
    const body =
      await request.json();

    const result =
      registrationSchema.safeParse(
        body
      );

    if (!result.success) {
      const fieldErrors: Record<
        string,
        string
      > = {};

      for (
        const issue of result.error
          .issues
      ) {
        const field =
          issue.path[0];

        if (
          typeof field ===
            "string" &&
          !fieldErrors[field]
        ) {
          fieldErrors[field] =
            issue.message;
        }
      }

      return respond(
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

    const registration =
      result.data;

    const strapiUrl =
      (
        process.env
          .NEXT_PUBLIC_STRAPI_URL ??
        "http://localhost:1337"
      ).replace(/\/+$/, "");

    const eventUrl =
      `${strapiUrl}/api/events/` +
      `${registration.eventId}` +
      `?populate=house&locale=${locale}`;

    console.log(
      "STRAPI EVENT REQUEST:",
      eventUrl
    );

    const eventResponse =
      await fetch(
        eventUrl,
        {
          cache: "no-store",
        }
      );

    if (
      !eventResponse.ok
    ) {
      const errorText =
        await eventResponse.text();

      console.error(
        "STRAPI EVENT ERROR:",
        eventResponse.status,
        eventResponse.statusText,
        errorText
      );

      return respond(
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

    const eventData =
      await eventResponse.json();

    const strapiEvent =
      eventData.data;

    if (!strapiEvent) {
      return respond(
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

    if (
      strapiEvent.house?.slug !==
      registration.houseSlug
    ) {
      return respond(
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

    if (
      strapiEvent
        .registrationDeadline
    ) {
      const deadline =
        new Date(
          strapiEvent
            .registrationDeadline
        );

      if (
        new Date() >
        deadline
      ) {
        return respond(
          {
            success: false,
            type:
              "registration_closed",
            message:
              "Les inscriptions à cette activité sont maintenant closes.",
          },
          {
            status: 409,
          }
        );
      }
    }

    const capacity:
      | number
      | undefined =
      strapiEvent.capacity;

    if (capacity) {
      const countResult =
        await appDb.query(
          `
          select
            coalesce(
              sum(participants),
              0
            )::integer
              as registered
          from event_registrations
          where event_id = $1
          and status in (
            'pending',
            'confirmed'
          )
          `,
          [
            registration.eventId,
          ]
        );

      const registeredParticipants =
        Number(
          countResult.rows[0]
            ?.registered ?? 0
        );

      const remainingPlaces =
        capacity -
        registeredParticipants;

      if (
        registration.participants >
        remainingPlaces
      ) {
        return respond(
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

    try {
      await appDb.query(
        `
        insert into
          event_registrations (
            house_slug,
            event_id,
            event_title,
            first_name,
            last_name,
            email,
            phone,
            participants,
            message,
            consent,
            status
          )
        values (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          'pending'
        )
        `,
        [
          registration.houseSlug,
          registration.eventId,
          strapiEvent.title,
          registration.firstName,
          registration.lastName,
          registration.email,
          registration.phone ??
            null,
          registration.participants,
          registration.message ??
            null,
          registration.consent ??
            false,
        ]
      );
    } catch (error: unknown) {
      const pgError =
        error as {
          code?: string;
        };

      console.error(
        "POSTGRES REGISTRATION ERROR:",
        error
      );

      if (
        pgError.code ===
        "23505"
      ) {
        return respond(
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

      return respond(
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

    /*
     * Confirmation Brevo
     */
    if (
      process.env
        .BREVO_API_KEY &&
      process.env
        .BREVO_SENDER_EMAIL
    ) {
      const safeFirstName =
        escapeHtml(
          registration.firstName
        );

      const safeEventTitle =
        escapeHtml(
          strapiEvent.title
        );

      const safeLocation =
        escapeHtml(
          strapiEvent.location ??
            ""
        );

      const eventDate =
        formatEventDate(
          strapiEvent.startDate ??
            strapiEvent.start ??
            null,
          locale
        );

      const confirmationSubject =
        locale === "eu"
          ? `Izen-ematea baieztatuta — ${strapiEvent.title}`
          : `Inscription enregistrée — ${strapiEvent.title}`;

      const confirmationHtml =
        locale === "eu"
          ? `
            <h1 style="color:#8F5A53;">
              Zure izen-ematea jaso dugu
            </h1>

            <p>
              Kaixo ${safeFirstName},
            </p>

            <p>
              Zure izen-ematea
              behar bezala jaso dugu:
            </p>

            <p>
              <strong>
                ${safeEventTitle}
              </strong>
            </p>

            ${
              eventDate
                ? `
                  <p>
                    <strong>
                      Data:
                    </strong>
                    ${escapeHtml(
                      eventDate
                    )}
                  </p>
                `
                : ""
            }

            ${
              safeLocation
                ? `
                  <p>
                    <strong>
                      Lekua:
                    </strong>
                    ${safeLocation}
                  </p>
                `
                : ""
            }

            <p>
              <strong>
                Parte-hartzaile kopurua:
              </strong>
              ${registration.participants}
            </p>

            <p>
              Laster arte,<br />
              Maison des Femmes —
              Emazteen Etxea
            </p>
          `
          : `
            <h1 style="color:#8F5A53;">
              Votre inscription
              a bien été enregistrée
            </h1>

            <p>
              Bonjour ${safeFirstName},
            </p>

            <p>
              Nous avons bien reçu
              votre inscription à :
            </p>

            <p>
              <strong>
                ${safeEventTitle}
              </strong>
            </p>

            ${
              eventDate
                ? `
                  <p>
                    <strong>
                      Date :
                    </strong>
                    ${escapeHtml(
                      eventDate
                    )}
                  </p>
                `
                : ""
            }

            ${
              safeLocation
                ? `
                  <p>
                    <strong>
                      Lieu :
                    </strong>
                    ${safeLocation}
                  </p>
                `
                : ""
            }

            <p>
              <strong>
                Nombre de participantes :
              </strong>
              ${registration.participants}
            </p>

            <p>
              À bientôt,<br />
              Maison des Femmes —
              Emazteen Etxea
            </p>
          `;

      const brevoResponse =
        await fetch(
          "https://api.brevo.com/v3/smtp/email",
          {
            method: "POST",

            headers: {
              "api-key":
                process.env
                  .BREVO_API_KEY,

              accept:
                "application/json",

              "content-type":
                "application/json",
            },

            body:
              JSON.stringify({
                sender: {
                  name:
                    process.env
                      .BREVO_SENDER_NAME ??
                    "Maison des Femmes",

                  email:
                    process.env
                      .BREVO_SENDER_EMAIL,
                },

                to: [
                  {
                    email:
                      registration.email,

                    name:
                      `${registration.firstName} ${registration.lastName}`,
                  },
                ],

                subject:
                  confirmationSubject,

                htmlContent:
                  confirmationHtml,
              }),
          }
        );

      if (
        !brevoResponse.ok
      ) {
        console.error(
          "BREVO REGISTRATION CONFIRMATION ERROR:",
          brevoResponse.status,
          await brevoResponse.text()
        );
      }
    }

    return respond(
      {
        success: true,
        message:
          locale === "eu"
            ? "Zure izen-ematea behar bezala erregistratu da."
            : "Votre inscription a bien été enregistrée.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "REGISTRATION ERROR:",
      error
    );

    return respond(
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