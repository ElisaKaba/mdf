"use client";

import Link from "@/components/LocaleLink";
import { useState } from "react";

import styles from "./RegistrationForm.module.css";

type Locale = "fr" | "eu";

type RegistrationFormProps = {
  eventId: string;
  eventTitle: string;
  houseSlug: string;
  locale?: Locale;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  participants: number;
  message: string;
};

type FieldErrors =
  Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  participants: 1,
  message: "",
};

const translations = {
  fr: {
    title: "S’inscrire à cette activité",

    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse e-mail",
    phone: "Téléphone",
    participants: "Nombre de participantes",
    message: "Message",

    submitting: "Envoi en cours…",
    submit: "Valider mon inscription",

    success:
      "Votre inscription a bien été enregistrée.",

    serverError:
      "Impossible de contacter le serveur. Réessayez dans quelques instants.",

    privacy:
      "Les informations recueillies sont utilisées pour gérer votre inscription à cette activité et pour établir les bilans d’activité de l’association. Les données nominatives sont conservées pendant deux ans maximum après l’activité, puis supprimées ou anonymisées. Vous pouvez exercer vos droits en écrivant à emazteen.etxea@gmail.com.",

    privacyLink:
      "Consulter notre politique de confidentialité.",
  },

  eu: {
    title: "Jarduera honetan izena eman",

    firstName: "Izena",
    lastName: "Abizena",
    email: "Helbide elektronikoa",
    phone: "Telefonoa",
    participants: "Parte-hartzaileen kopurua",
    message: "Mezua",

    submitting: "Bidaltzen…",
    submit: "Izen-ematea baieztatu",

    success:
      "Zure izen-ematea behar bezala erregistratu da.",

    serverError:
      "Ezin izan da zerbitzariarekin konektatu. Saiatu berriro une batzuk barru.",

    privacy:
      "Bildutako informazioa jarduera honetan zure izen-ematea kudeatzeko eta elkartearen jarduera-balantzeak egiteko erabiltzen da. Datu izendunak jardueraren ondoren gehienez bi urtez gordeko dira, eta ondoren ezabatu edo anonimotu egingo dira. Zure eskubideak erabiltzeko, idatzi emazteen.etxea@gmail.com helbidera.",

    privacyLink:
      "Ikusi gure pribatutasun-politika.",
  },
};

export default function RegistrationForm({
  eventId,
  eventTitle,
  houseSlug,
  locale = "fr",
}: RegistrationFormProps) {
  const [form, setForm] =
    useState<FormState>(initialState);

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState<FieldErrors>({});

  const [
    globalError,
    setGlobalError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const t = translations[locale];

  function clearFieldError(
    field: keyof FormState
  ) {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };

      delete next[field];

      return next;
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsSubmitting(true);
    setFieldErrors({});
    setGlobalError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "/api/registrations",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
            "X-MDF-Locale": locale,
          },

          body: JSON.stringify({
            eventId,
            eventTitle,
            houseSlug,

            firstName:
              form.firstName,

            lastName:
              form.lastName,

            email:
              form.email,

            phone:
              form.phone ||
              undefined,

            participants:
              form.participants,

            message:
              form.message ||
              undefined,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        if (data.fieldErrors) {
          setFieldErrors(
            data.fieldErrors
          );
        }

        if (data.message) {
          setGlobalError(
            data.message
          );
        }

        return;
      }

      setSuccessMessage(
        t.success
      );

      setForm(initialState);
      setFieldErrors({});
    } catch {
      setGlobalError(
        t.serverError
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <h2>
        {t.title}
      </h2>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="firstName">
            {t.firstName}{" "}
            <span
              className={
                styles.required
              }
              aria-hidden="true"
            >
              *
            </span>
          </label>

          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            value={
              form.firstName
            }
            aria-invalid={Boolean(
              fieldErrors.firstName
            )}
            aria-describedby={
              fieldErrors.firstName
                ? "firstName-error"
                : undefined
            }
            onChange={(event) => {
              setForm({
                ...form,
                firstName:
                  event.target.value,
              });

              clearFieldError(
                "firstName"
              );
            }}
          />

          {fieldErrors.firstName && (
            <p
              id="firstName-error"
              className={
                styles.fieldError
              }
              role="alert"
            >
              {
                fieldErrors.firstName
              }
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="lastName">
            {t.lastName}{" "}
            <span
              className={
                styles.required
              }
              aria-hidden="true"
            >
              *
            </span>
          </label>

          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            value={
              form.lastName
            }
            aria-invalid={Boolean(
              fieldErrors.lastName
            )}
            aria-describedby={
              fieldErrors.lastName
                ? "lastName-error"
                : undefined
            }
            onChange={(event) => {
              setForm({
                ...form,
                lastName:
                  event.target.value,
              });

              clearFieldError(
                "lastName"
              );
            }}
          />

          {fieldErrors.lastName && (
            <p
              id="lastName-error"
              className={
                styles.fieldError
              }
              role="alert"
            >
              {
                fieldErrors.lastName
              }
            </p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="email">
          {t.email}{" "}
          <span
            className={
              styles.required
            }
            aria-hidden="true"
          >
            *
          </span>
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          value={
            form.email
          }
          aria-invalid={Boolean(
            fieldErrors.email
          )}
          aria-describedby={
            fieldErrors.email
              ? "email-error"
              : undefined
          }
          onChange={(event) => {
            setForm({
              ...form,
              email:
                event.target.value,
            });

            clearFieldError(
              "email"
            );
          }}
        />

        {fieldErrors.email && (
          <p
            id="email-error"
            className={
              styles.fieldError
            }
            role="alert"
          >
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">
          {t.phone}
        </label>

        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={
            form.phone
          }
          aria-invalid={Boolean(
            fieldErrors.phone
          )}
          onChange={(event) => {
            setForm({
              ...form,
              phone:
                event.target.value,
            });

            clearFieldError(
              "phone"
            );
          }}
        />

        {fieldErrors.phone && (
          <p
            className={
              styles.fieldError
            }
            role="alert"
          >
            {fieldErrors.phone}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="participants">
          {t.participants}{" "}
          <span
            className={
              styles.required
            }
            aria-hidden="true"
          >
            *
          </span>
        </label>

        <input
          id="participants"
          type="number"
          min={1}
          max={10}
          value={
            form.participants
          }
          aria-invalid={Boolean(
            fieldErrors.participants
          )}
          onChange={(event) => {
            setForm({
              ...form,
              participants:
                Number(
                  event.target.value
                ),
            });

            clearFieldError(
              "participants"
            );
          }}
        />

        {fieldErrors.participants && (
          <p
            className={
              styles.fieldError
            }
            role="alert"
          >
            {
              fieldErrors.participants
            }
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="message">
          {t.message}
        </label>

        <textarea
          id="message"
          rows={4}
          maxLength={1000}
          value={
            form.message
          }
          aria-invalid={Boolean(
            fieldErrors.message
          )}
          onChange={(event) => {
            setForm({
              ...form,
              message:
                event.target.value,
            });

            clearFieldError(
              "message"
            );
          }}
        />

        {fieldErrors.message && (
          <p
            className={
              styles.fieldError
            }
            role="alert"
          >
            {fieldErrors.message}
          </p>
        )}
      </div>

      <div
        className={
          styles.privacyNotice
        }
      >
        <p>
          {t.privacy}
        </p>

        <Link
          href={`/${houseSlug}/politique-de-confidentialite`}
        >
          {t.privacyLink}
        </Link>
      </div>

      {globalError && (
        <p
          className={
            styles.error
          }
          role="alert"
        >
          {globalError}
        </p>
      )}

      {successMessage && (
        <p
          className={
            styles.success
          }
          role="status"
        >
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        className={
          styles.submitButton
        }
        disabled={
          isSubmitting
        }
      >
        {isSubmitting
          ? t.submitting
          : t.submit}
      </button>
    </form>
  );
}