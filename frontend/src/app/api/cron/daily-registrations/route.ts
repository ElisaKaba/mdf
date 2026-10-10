import { NextResponse } from "next/server";

import { appDb } from "@/lib/db/appDb";

type Registration = {
  id: string;
  event_id: string;
  event_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  participants: number;
  message: string | null;
  status: string;
  created_at: string;
};

function escapeHtml(
  value:
    | string
    | null
    | undefined
) {
  return (value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(
  date: string
) {
  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Europe/Paris",
    }
  ).format(
    new Date(date)
  );
}

export async function GET(
  request: Request
) {
  const authHeader =
    request.headers.get(
      "authorization"
    );

  if (
    !process.env
      .CRON_SECRET ||
    authHeader !==
      `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      {
        error:
          "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    /*
     * Inscriptions qui
     * n'ont jamais été envoyées
     * dans un digest.
     */
    const result =
      await appDb.query<
        Registration
      >(
        `
        select
          id,
          event_id,
          event_title,
          first_name,
          last_name,
          email,
          phone,
          participants,
          message,
          status,
          created_at
        from event_registrations
        where digest_sent_at
          is null
        order by created_at asc
        `
      );

    const registrations =
      result.rows;

    if (
      registrations.length ===
      0
    ) {
      return NextResponse.json(
        {
          ok: true,
          sent: false,
          count: 0,
        }
      );
    }

    const grouped =
      registrations.reduce<
        Record<
          string,
          Registration[]
        >
      >(
        (
          acc,
          registration
        ) => {
          const key =
            registration
              .event_title ||
            "Activité sans titre";

          acc[key] ??= [];

          acc[key].push(
            registration
          );

          return acc;
        },
        {}
      );

    const totalParticipants =
      registrations.reduce(
        (
          total,
          registration
        ) =>
          total +
          Number(
            registration
              .participants ??
              1
          ),
        0
      );

    const sections =
      Object.entries(grouped)
        .map(
          (
            [
              eventTitle,
              items,
            ]
          ) => {
            const participants =
              items.reduce(
                (
                  total,
                  item
                ) =>
                  total +
                  Number(
                    item
                      .participants ??
                      1
                  ),
                0
              );

            const rows =
              items
                .map(
                  (
                    item
                  ) => `
                    <tr>
                      <td>
                        ${escapeHtml(
                          item.first_name
                        )}
                        ${escapeHtml(
                          item.last_name
                        )}
                      </td>

                      <td>
                        ${escapeHtml(
                          item.email
                        )}
                      </td>

                      <td>
                        ${escapeHtml(
                          item.phone
                        ) || "—"}
                      </td>

                      <td>
                        ${item.participants}
                      </td>

                      <td>
                        ${escapeHtml(
                          item.status
                        )}
                      </td>

                      <td>
                        ${formatDate(
                          item.created_at
                        )}
                      </td>
                    </tr>
                  `
                )
                .join("");

            return `
              <section>
                <h2
                  style="
                    color:#8F5A53;
                  "
                >
                  ${escapeHtml(
                    eventTitle
                  )}
                </h2>

                <p>
                  <strong>
                    ${items.length}
                  </strong>
                  nouvelle(s)
                  inscription(s) —
                  <strong>
                    ${participants}
                  </strong>
                  participante(s)
                </p>

                <table
                  style="
                    width:100%;
                    border-collapse:
                    collapse;
                  "
                >
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>
                        Téléphone
                      </th>
                      <th>Places</th>
                      <th>Statut</th>
                      <th>
                        Inscription
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    ${rows}
                  </tbody>
                </table>
              </section>
            `;
          }
        )
        .join("");

    const dateLabel =
      new Intl.DateTimeFormat(
        "fr-FR",
        {
          dateStyle: "long",
          timeZone:
            "Europe/Paris",
        }
      ).format(
        new Date()
      );

    const recipientEmails =
      process.env
        .REGISTRATION_DIGEST_RECIPIENTS
        ?.split(",")
        .map(
          (email) =>
            email.trim()
        )
        .filter(Boolean);

    if (
      !process.env
        .BREVO_API_KEY ||
      !process.env
        .BREVO_SENDER_EMAIL ||
      !recipientEmails
        ?.length
    ) {
      return NextResponse.json(
        {
          error:
            "Configuration Brevo incomplète",
        },
        {
          status: 500,
        }
      );
    }

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

              to:
                recipientEmails.map(
                  (email) => ({
                    email,
                  })
                ),

              subject:
                `Inscriptions MDF — ${dateLabel}`,

              htmlContent: `
                <h1>
                  Récapitulatif
                  des inscriptions
                </h1>

                <p>
                  ${dateLabel}
                </p>

                <p>
                  <strong>
                    ${registrations.length}
                  </strong>
                  nouvelle(s)
                  inscription(s),
                  représentant
                  <strong>
                    ${totalParticipants}
                  </strong>
                  participante(s).
                </p>

                ${sections}

                <hr />

                <p>
                  Maison des Femmes ·
                  Emazteen Etxea
                </p>
              `,
            }),
        }
      );

    if (
      !brevoResponse.ok
    ) {
      console.error(
        "BREVO DIGEST ERROR:",
        brevoResponse.status,
        await brevoResponse.text()
      );

      return NextResponse.json(
        {
          error:
            "Brevo send failed",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Brevo a réussi :
     * seulement maintenant
     * on marque les lignes.
     */
    const ids =
      registrations.map(
        (registration) =>
          registration.id
      );

    await appDb.query(
      `
      update event_registrations
      set digest_sent_at =
        now()
      where id =
        any($1::uuid[])
      `,
      [ids]
    );

    return NextResponse.json(
      {
        ok: true,
        sent: true,
        registrations:
          registrations.length,
        participants:
          totalParticipants,
      }
    );
  } catch (error) {
    console.error(
      "DAILY REGISTRATION DIGEST ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}