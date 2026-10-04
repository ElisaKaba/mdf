import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

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

function escapeHtml(value: string | null | undefined) {
  return (value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date(date));
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const {
    data,
    error,
  } = await supabaseAdmin
    .from("event_registrations")
    .select(`
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
    `)
    .is("digest_sent_at", null)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Erreur récupération inscriptions:",
      error
    );

    return NextResponse.json(
      { error: "Supabase error" },
      { status: 500 }
    );
  }

  const registrations =
    (data ?? []) as Registration[];

  /*
   * Aucun nouvel inscrit :
   * aucun email envoyé.
   */
  if (registrations.length === 0) {
    return NextResponse.json({
      ok: true,
      sent: false,
      count: 0,
    });
  }

  /*
   * Regroupement par activité.
   */
  const grouped =
    registrations.reduce<
      Record<string, Registration[]>
    >((acc, registration) => {
      const key =
        registration.event_title ||
        "Activité sans titre";

      acc[key] ??= [];
      acc[key].push(registration);

      return acc;
    }, {});

  const totalParticipants =
    registrations.reduce(
      (total, registration) =>
        total +
        (registration.participants ?? 1),
      0
    );

  const sections = Object.entries(grouped)
    .map(([eventTitle, items]) => {
      const participants =
        items.reduce(
          (total, item) =>
            total +
            (item.participants ?? 1),
          0
        );

      const rows = items
        .map(
          (item) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #ddd;">
              ${escapeHtml(item.first_name)}
              ${escapeHtml(item.last_name)}
            </td>

            <td style="padding:8px;border-bottom:1px solid #ddd;">
              <a href="mailto:${escapeHtml(item.email)}">
                ${escapeHtml(item.email)}
              </a>
            </td>

            <td style="padding:8px;border-bottom:1px solid #ddd;">
              ${escapeHtml(item.phone) || "—"}
            </td>

            <td style="padding:8px;border-bottom:1px solid #ddd;text-align:center;">
              ${item.participants}
            </td>

            <td style="padding:8px;border-bottom:1px solid #ddd;">
              ${escapeHtml(item.status)}
            </td>

            <td style="padding:8px;border-bottom:1px solid #ddd;">
              ${formatDate(item.created_at)}
            </td>
          </tr>
        `
        )
        .join("");

      return `
        <section style="margin-bottom:32px;">
          <h2 style="color:#8F5A53;">
            ${escapeHtml(eventTitle)}
          </h2>

          <p>
            <strong>${items.length}</strong>
            nouvelle(s) inscription(s) —
            <strong>${participants}</strong>
            participante(s)
          </p>

          <table
            style="
              width:100%;
              border-collapse:collapse;
              font-family:Arial,sans-serif;
              font-size:14px;
            "
          >
            <thead>
              <tr>
                <th style="text-align:left;padding:8px;">Nom</th>
                <th style="text-align:left;padding:8px;">Email</th>
                <th style="text-align:left;padding:8px;">Téléphone</th>
                <th style="padding:8px;">Places</th>
                <th style="text-align:left;padding:8px;">Statut</th>
                <th style="text-align:left;padding:8px;">Inscription</th>
              </tr>
            </thead>

            <tbody>
              ${rows}
            </tbody>
          </table>
        </section>
      `;
    })
    .join("");

  const dateLabel =
    new Intl.DateTimeFormat(
      "fr-FR",
      {
        dateStyle: "long",
        timeZone: "Europe/Paris",
      }
    ).format(new Date());

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
      <body
        style="
          font-family:Arial,sans-serif;
          color:#333;
          max-width:900px;
          margin:auto;
        "
      >
        <h1>
          Récapitulatif des inscriptions
        </h1>

        <p>
          ${dateLabel}
        </p>

        <p>
          <strong>
            ${registrations.length}
          </strong>
          nouvelle(s) inscription(s),
          représentant
          <strong>
            ${totalParticipants}
          </strong>
          participante(s).
        </p>

        ${sections}

        <hr>

        <p style="font-size:12px;color:#666;">
          Message automatique —
          Maison des Femmes · Emazteen Etxea
        </p>
      </body>
    </html>
  `;

  const recipientEmails =
    process.env
      .REGISTRATION_DIGEST_RECIPIENTS
      ?.split(",")
      .map((email) => email.trim())
      .filter(Boolean);

  if (
    !process.env.BREVO_API_KEY ||
    !process.env.BREVO_SENDER_EMAIL ||
    !recipientEmails?.length
  ) {
    return NextResponse.json(
      {
        error:
          "Configuration Brevo incomplète",
      },
      { status: 500 }
    );
  }

  const brevoResponse = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",

      headers: {
        "api-key":
          process.env.BREVO_API_KEY,

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

        to: recipientEmails.map(
          (email) => ({
            email,
          })
        ),

        subject:
          `Inscriptions MDF — ${dateLabel}`,

        htmlContent,

        tags: [
          "inscriptions",
          "daily-digest",
        ],
      }),
    }
  );

  if (!brevoResponse.ok) {
    const body =
      await brevoResponse.text();

    console.error(
      "Erreur Brevo:",
      brevoResponse.status,
      body
    );

    /*
     * IMPORTANT :
     * on ne marque rien comme envoyé.
     */
    return NextResponse.json(
      {
        error:
          "Brevo send failed",
      },
      { status: 500 }
    );
  }

  /*
   * L'email est parti :
   * seulement maintenant on marque
   * les inscriptions comme traitées.
   */
  const ids =
    registrations.map(
      (registration) =>
        registration.id
    );

  const {
    error: updateError,
  } = await supabaseAdmin
    .from("event_registrations")
    .update({
      digest_sent_at:
        new Date().toISOString(),
    })
    .in("id", ids);

  if (updateError) {
    console.error(
      "Email envoyé mais erreur digest_sent_at:",
      updateError
    );

    return NextResponse.json(
      {
        ok: true,
        sent: true,
        warning:
          "Email envoyé mais inscriptions non marquées",
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    ok: true,
    sent: true,
    registrations:
      registrations.length,
    participants:
      totalParticipants,
  });
}