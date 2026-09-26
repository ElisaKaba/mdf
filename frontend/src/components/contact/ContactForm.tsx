"use client";

import { useState } from "react";

import styles from "./ContactForm.module.css";

type ContactFormProps = {
  houseSlug: string;
};

type Locale = "fr" | "eu";

type SubjectOption =
  | ""
  | "volunteer"
  | "workshop"
  | "help"
  | "other";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  subject: SubjectOption;
  subjectDetails: string;
  message: string;
  consent: boolean;
};

type FieldErrors =
  Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  subjectDetails: "",
  message: "",
  consent: false,
};

const translations = {
  fr: {
    title: "Nous contacter",
    switchLanguage: "Euskaraz",

    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse e-mail",

    subject: "Sujet",
    chooseSubject: "Choisir un sujet",

    volunteer: "Devenir bénévole",
    workshop: "Proposer un atelier",
    help: "Besoin d’aide",
    other: "Autre",

    subjectDetails: "Précisez votre demande",

    message: "Message",

    consent:
      "J’accepte que mes informations soient utilisées pour répondre à ma demande.",

    submit: "Envoyer",
    submitting: "Envoi en cours…",

    success:
      "Votre message a bien été envoyé. La Maison des Femmes pourra revenir vers vous.",

    serverError:
      "Impossible de contacter le serveur. Réessayez dans quelques instants.",

    unexpectedError:
      "Une erreur inattendue est survenue. Réessayez dans quelques instants.",

    errors: {
      firstName:
        "Le prénom doit contenir au moins 2 caractères.",

      lastName:
        "Le nom doit contenir au moins 2 caractères.",

      email:
        "Saisissez une adresse e-mail valide.",

      subject:
        "Choisissez un sujet.",

      subjectDetails:
        "Précisez votre demande.",

      message:
        "Le message doit contenir au moins 10 caractères.",

      consent:
        "Vous devez accepter l’utilisation de vos données pour envoyer votre message.",
    },
  },

  eu: {
    title: "Gurekin harremanetan jarri",
    switchLanguage: "Français",

    firstName: "Izena",
    lastName: "Abizena",
    email: "Helbide elektronikoa",

    subject: "Gaia",
    chooseSubject: "Aukeratu gai bat",

    volunteer: "Boluntario izan",
    workshop: "Tailer bat proposatu",
    help: "Laguntza behar dut",
    other: "Bestelakoa",

    subjectDetails:
      "Zehaztu zure eskaera",

    message: "Mezua",

    consent:
      "Nire informazioa nire eskaerari erantzuteko erabiltzea onartzen dut.",

    submit: "Bidali",
    submitting: "Bidaltzen…",

    success:
      "Zure mezua behar bezala bidali da. Emakumeen Etxea zurekin harremanetan jarri ahal izango da.",

    serverError:
      "Ezin izan da zerbitzariarekin konektatu. Saiatu berriro une batzuk barru.",

    unexpectedError:
      "Ustekabeko errore bat gertatu da. Saiatu berriro une batzuk barru.",

    errors: {
      firstName:
        "Izenak gutxienez 2 karaktere izan behar ditu.",

      lastName:
        "Abizenak gutxienez 2 karaktere izan behar ditu.",

      email:
        "Sartu baliozko helbide elektroniko bat.",

      subject:
        "Aukeratu gai bat.",

      subjectDetails:
        "Zehaztu zure eskaera.",

      message:
        "Mezuak gutxienez 10 karaktere izan behar ditu.",

      consent:
        "Zure datuen erabilera onartu behar duzu mezua bidaltzeko.",
    },
  },
};

export default function ContactForm({
  houseSlug,
}: ContactFormProps) {
  const [locale, setLocale] =
    useState<Locale>("fr");

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

  function validateForm() {
    const errors: FieldErrors = {};

    if (
      form.firstName.trim().length < 2
    ) {
      errors.firstName =
        t.errors.firstName;
    }

    if (
      form.lastName.trim().length < 2
    ) {
      errors.lastName =
        t.errors.lastName;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        form.email.trim()
      )
    ) {
      errors.email =
        t.errors.email;
    }

    if (!form.subject) {
      errors.subject =
        t.errors.subject;
    }

    if (
      form.subject === "other" &&
      !form.subjectDetails.trim()
    ) {
      errors.subjectDetails =
        t.errors.subjectDetails;
    }

    if (
      form.message.trim().length < 10
    ) {
      errors.message =
        t.errors.message;
    }

    if (!form.consent) {
      errors.consent =
        t.errors.consent;
    }

    setFieldErrors(errors);

    return (
      Object.keys(errors).length === 0
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setGlobalError("");
    setSuccessMessage("");

    const isValid =
      validateForm();

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/contact",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            houseSlug,
            locale,
            ...form,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        /*
         * La validation principale
         * est déjà faite côté client.
         *
         * On conserve quand même
         * les erreurs serveur si besoin.
         */
        if (data.fieldErrors) {
          setFieldErrors(
            data.fieldErrors
          );
        }

        setGlobalError(
          data.message ??
            t.unexpectedError
        );

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
      <div
        className={
          styles.formHeader
        }
      >
        <h1>
          {t.title}
        </h1>

        <button
          type="button"
          className={
            styles.languageButton
          }
          onClick={() => {
            setLocale(
              (
                current
              ) =>
                current === "fr"
                  ? "eu"
                  : "fr"
            );

            setFieldErrors({});
            setGlobalError("");
            setSuccessMessage("");
          }}
        >
          {t.switchLanguage}
        </button>
      </div>

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
          value={form.email}
          aria-invalid={Boolean(
            fieldErrors.email
          )}
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
        <label htmlFor="subject">
          {t.subject}{" "}
          <span
            className={
              styles.required
            }
            aria-hidden="true"
          >
            *
          </span>
        </label>

        <select
          id="subject"
          value={form.subject}
          aria-invalid={Boolean(
            fieldErrors.subject
          )}
          onChange={(event) => {
            const subject =
              event.target
                .value as SubjectOption;

            setForm({
              ...form,
              subject,

              subjectDetails:
                subject === "other"
                  ? form.subjectDetails
                  : "",
            });

            clearFieldError(
              "subject"
            );

            if (
              subject !== "other"
            ) {
              clearFieldError(
                "subjectDetails"
              );
            }
          }}
        >
          <option value="">
            {t.chooseSubject}
          </option>

          <option value="volunteer">
            {t.volunteer}
          </option>

          <option value="workshop">
            {t.workshop}
          </option>

          <option value="help">
            {t.help}
          </option>

          <option value="other">
            {t.other}
          </option>
        </select>

        {fieldErrors.subject && (
          <p
            className={
              styles.fieldError
            }
            role="alert"
          >
            {fieldErrors.subject}
          </p>
        )}
      </div>

      {form.subject === "other" && (
        <div className={styles.field}>
          <label
            htmlFor="subjectDetails"
          >
            {t.subjectDetails}{" "}
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
            id="subjectDetails"
            type="text"
            value={
              form.subjectDetails
            }
            aria-invalid={Boolean(
              fieldErrors.subjectDetails
            )}
            onChange={(event) => {
              setForm({
                ...form,
                subjectDetails:
                  event.target.value,
              });

              clearFieldError(
                "subjectDetails"
              );
            }}
          />

          {fieldErrors.subjectDetails && (
            <p
              className={
                styles.fieldError
              }
              role="alert"
            >
              {
                fieldErrors.subjectDetails
              }
            </p>
          )}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="message">
          {t.message}{" "}
          <span
            className={
              styles.required
            }
            aria-hidden="true"
          >
            *
          </span>
        </label>

        <textarea
          id="message"
          rows={6}
          maxLength={2000}
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

      <div>
        <label
          className={
            styles.consent
          }
        >
          <input
            type="checkbox"
            checked={
              form.consent
            }
            aria-invalid={Boolean(
              fieldErrors.consent
            )}
            onChange={(event) => {
              setForm({
                ...form,
                consent:
                  event.target
                    .checked,
              });

              clearFieldError(
                "consent"
              );
            }}
          />

          <span>
            {t.consent}{" "}
            <span
              className={
                styles.required
              }
              aria-hidden="true"
            >
              *
            </span>
          </span>
        </label>

        {fieldErrors.consent && (
          <p
            className={
              styles.fieldError
            }
            role="alert"
          >
            {fieldErrors.consent}
          </p>
        )}
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
        disabled={isSubmitting}
      >
        {isSubmitting
          ? t.submitting
          : t.submit}
      </button>
    </form>
  );
}