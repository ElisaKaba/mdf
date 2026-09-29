"use client";

import Link from "next/link";
import { useState } from "react";

import styles from "./ContactForm.module.css";

type ContactFormProps = {
  houseSlug: string;
  defaultLocale: "fr" | "eu";
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

    submit: "Envoyer",
    submitting: "Envoi en cours…",

    success:
      "Votre message a bien été envoyé. La Maison des Femmes pourra revenir vers vous.",

    serverError:
      "Impossible de contacter le serveur. Réessayez dans quelques instants.",

    unexpectedError:
      "Une erreur inattendue est survenue. Réessayez dans quelques instants.",

    privacy:
      "Les informations recueillies sont utilisées uniquement pour traiter votre demande et vous répondre. Elles sont conservées pendant un an maximum après le dernier échange. Vous pouvez exercer vos droits en écrivant à emazteen.etxea@gmail.com.",

    privacyLink:
      "Consulter notre politique de confidentialité.",

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

    submit: "Bidali",
    submitting: "Bidaltzen…",

    success:
      "Zure mezua behar bezala bidali da. Emakumeen Etxea zurekin harremanetan jarri ahal izango da.",

    serverError:
      "Ezin izan da zerbitzariarekin konektatu. Saiatu berriro une batzuk barru.",

    unexpectedError:
      "Ustekabeko errore bat gertatu da. Saiatu berriro une batzuk barru.",

    privacy:
      "Bildutako informazioa zure eskaera tratatzeko eta zuri erantzuteko baino ez da erabiltzen. Datuak gehienez urtebetez gordeko dira azken harremanetik aurrera. Zure eskubideak erabiltzeko, idatzi emazteen.etxea@gmail.com helbidera.",

    privacyLink:
      "Ikusi gure pribatutasun-politika.",

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
    },
  },
};

export default function ContactForm({
  houseSlug,
  defaultLocale,
}: ContactFormProps) {
  const [locale, setLocale] =
    useState<Locale>(defaultLocale);

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
              (current) =>
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
        disabled={isSubmitting}
      >
        {isSubmitting
          ? t.submitting
          : t.submit}
      </button>
    </form>
  );
}