import { NextResponse } from "next/server";
import { localizeFormResponse } from "@/lib/i18n/formResponse";
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  const locale =
    request.headers.get("x-mdf-locale") === "eu"
      ? "eu"
      : "fr";

  const respond = (
    body: Parameters<typeof localizeFormResponse>[0],
    init?: ResponseInit
  ) =>
    NextResponse.json(
      localizeFormResponse(body, locale),
      init
    );

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

    const contact =
      result.data;

    const subjectLabel =
      getSubjectLabel(
        contact.subject,
        contact.subjectDetails
      );

    /*
     * 1. Enregistrement Supabase
     */
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

          status:
            "new",
        });

    if (error) {
      console.error(
        "SUPABASE CONTACT ERROR:",
        error
      );

      return respond(
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

    /*
     * 2. Préparation Brevo
     */
    const recipientEmail =
      process.env.CONTACT_RECIPIENT_EMAIL;

    const canSendEmails =
      Boolean(
        process.env.BREVO_API_KEY &&
        process.env.BREVO_SENDER_EMAIL
      );

    const safeFirstName =
      escapeHtml(contact.firstName);

    const safeLastName =
      escapeHtml(contact.lastName);

    const safeEmail =
      escapeHtml(contact.email);

    const safeSubject =
      escapeHtml(subjectLabel);

    const safeMessage =
      escapeHtml(contact.message);

    const safeHouseSlug =
      escapeHtml(contact.houseSlug);

    /*
     * 3. Mail interne à la MDF
     */
    if (
      canSendEmails &&
      recipientEmail
    ) {
      const internalResponse =
        await fetch(
          "https://api.brevo.com/v3/smtp/email",
          {
            method: "POST",

            headers: {
              "api-key":
                process.env.BREVO_API_KEY!,

              accept:
                "application/json",

              "content-type":
                "application/json",
            },

            body: JSON.stringify({
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
                    recipientEmail,
                },
              ],

              replyTo: {
                email:
                  contact.email,

                name:
                  `${contact.firstName} ${contact.lastName}`,
              },

              subject:
                `Nouveau message de contact — ${subjectLabel}`,

              htmlContent: `
                <!DOCTYPE html>
                <html lang="fr">
                  <body
                    style="
                      font-family:Arial,sans-serif;
                      color:#333;
                      max-width:700px;
                      margin:auto;
                    "
                  >
                    <h1 style="color:#8F5A53;">
                      Nouveau message de contact
                    </h1>

                    <p>
                      <strong>Maison :</strong>
                      ${safeHouseSlug}
                    </p>

                    <p>
                      <strong>Nom :</strong>
                      ${safeFirstName}
                      ${safeLastName}
                    </p>

                    <p>
                      <strong>Email :</strong>
                      <a href="mailto:${safeEmail}">
                        ${safeEmail}
                      </a>
                    </p>

                    <p>
                      <strong>Sujet :</strong>
                      ${safeSubject}
                    </p>

                    <hr />

                    <p>
                      <strong>Message :</strong>
                    </p>

                    <p style="white-space:pre-wrap;">
                      ${safeMessage}
                    </p>

                    <hr />

                    <p
                      style="
                        font-size:12px;
                        color:#666;
                      "
                    >
                      Message envoyé depuis le formulaire
                      de contact Maison des Femmes ·
                      Emazteen Etxea
                    </p>
                  </body>
                </html>
              `,
            }),
          }
        );

      if (!internalResponse.ok) {
        const internalError =
          await internalResponse.text();

        console.error(
          "BREVO CONTACT INTERNAL ERROR:",
          internalResponse.status,
          internalError
        );
      }
    }

    /*
     * 4. Mail de confirmation à la personne
     */
    if (canSendEmails) {
      const confirmationSubject =
        locale === "eu"
          ? "Zure mezua jaso dugu"
          : "Nous avons bien reçu votre message";

      const confirmationHtml =
        locale === "eu"
          ? `
            <!DOCTYPE html>
            <html lang="eu">
              <body
                style="
                  font-family:Arial,sans-serif;
                  color:#333;
                  max-width:700px;
                  margin:auto;
                "
              >
                <h1 style="color:#8F5A53;">
                  Eskerrik asko zure mezuagatik
                </h1>

                <p>
                  Kaixo ${safeFirstName},
                </p>

                <p>
                  Zure mezua behar bezala jaso dugu
                  Maison des Femmes — Emazteen Etxea-n.
                </p>

                <p>
                  <strong>Gaia :</strong>
                  ${safeSubject}
                </p>

                <p>
                  Ahal bezain laster erantzungo dizugu.
                </p>

                <p>
                  Laster arte,<br />
                  Maison des Femmes —
                  Emazteen Etxea
                </p>
              </body>
            </html>
          `
          : `
            <!DOCTYPE html>
            <html lang="fr">
              <body
                style="
                  font-family:Arial,sans-serif;
                  color:#333;
                  max-width:700px;
                  margin:auto;
                "
              >
                <h1 style="color:#8F5A53;">
                  Merci pour votre message
                </h1>

                <p>
                  Bonjour ${safeFirstName},
                </p>

                <p>
                  Nous avons bien reçu votre message
                  adressé à la Maison des Femmes —
                  Emazteen Etxea.
                </p>

                <p>
                  <strong>Sujet :</strong>
                  ${safeSubject}
                </p>

                <p>
                  Nous reviendrons vers vous
                  dès que possible.
                </p>

                <p>
                  À bientôt,<br />
                  Maison des Femmes —
                  Emazteen Etxea
                </p>
              </body>
            </html>
          `;

      const confirmationResponse =
        await fetch(
          "https://api.brevo.com/v3/smtp/email",
          {
            method: "POST",

            headers: {
              "api-key":
                process.env.BREVO_API_KEY!,

              accept:
                "application/json",

              "content-type":
                "application/json",
            },

            body: JSON.stringify({
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
                    contact.email,

                  name:
                    `${contact.firstName} ${contact.lastName}`,
                },
              ],

              subject:
                confirmationSubject,

              htmlContent:
                confirmationHtml,
            }),
          }
        );

      if (!confirmationResponse.ok) {
        const confirmationError =
          await confirmationResponse.text();

        console.error(
          "BREVO CONTACT CONFIRMATION ERROR:",
          confirmationResponse.status,
          confirmationError
        );
      }
    }

    /*
     * 5. Réponse au formulaire
     */
    return respond(
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
      "CONTACT ERROR:",
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