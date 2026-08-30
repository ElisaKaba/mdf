"use client";

import { useState } from "react";

import styles from "./RegistrationForm.module.css";

type RegistrationFormProps = {
  eventId: string;
  eventTitle: string;
  houseSlug: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  participants: number;
  message: string;
  consent: boolean;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  participants: 1,
  message: "",
  consent: false,
};

export default function RegistrationForm({
  eventId,
  eventTitle,
  houseSlug,
}: RegistrationFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(field: keyof FormState) {
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
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          eventTitle,
          houseSlug,

          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone || undefined,
          participants: form.participants,
          message: form.message || undefined,
          consent: form.consent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }

        if (data.message) {
          setGlobalError(data.message);
        }

        return;
      }

      setSuccessMessage(
        data.message ??
          "Votre inscription a bien été enregistrée."
      );

      setForm(initialState);
      setFieldErrors({});
    } catch {
      setGlobalError(
        "Impossible de contacter le serveur. Réessayez dans quelques instants."
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
      <h2>S’inscrire à cette activité</h2>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="firstName">
            Prénom <span
  className={styles.required}
  aria-hidden="true"
>
  *
</span>
          </label>

          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            aria-invalid={Boolean(fieldErrors.firstName)}
            aria-describedby={
              fieldErrors.firstName
                ? "firstName-error"
                : undefined
            }
            onChange={(event) => {
              setForm({
                ...form,
                firstName: event.target.value,
              });

              clearFieldError("firstName");
            }}
          />

          {fieldErrors.firstName && (
            <p
              id="firstName-error"
              className={styles.fieldError}
              role="alert"
            >
              {fieldErrors.firstName}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="lastName">
            Nom <span
  className={styles.required}
  aria-hidden="true"
>
  *
</span>
          </label>

          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            aria-invalid={Boolean(fieldErrors.lastName)}
            aria-describedby={
              fieldErrors.lastName
                ? "lastName-error"
                : undefined
            }
            onChange={(event) => {
              setForm({
                ...form,
                lastName: event.target.value,
              });

              clearFieldError("lastName");
            }}
          />

          {fieldErrors.lastName && (
            <p
              id="lastName-error"
              className={styles.fieldError}
              role="alert"
            >
              {fieldErrors.lastName}
            </p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="email">
          Adresse e-mail <span
  className={styles.required}
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
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={
            fieldErrors.email
              ? "email-error"
              : undefined
          }
          onChange={(event) => {
            setForm({
              ...form,
              email: event.target.value,
            });

            clearFieldError("email");
          }}
        />

        {fieldErrors.email && (
          <p
            id="email-error"
            className={styles.fieldError}
            role="alert"
          >
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">
          Téléphone
        </label>

        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          aria-invalid={Boolean(fieldErrors.phone)}
          onChange={(event) => {
            setForm({
              ...form,
              phone: event.target.value,
            });

            clearFieldError("phone");
          }}
        />

        {fieldErrors.phone && (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.phone}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="participants">
          Nombre de participantes{" "}
          <span
  className={styles.required}
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
          value={form.participants}
          aria-invalid={Boolean(fieldErrors.participants)}
          onChange={(event) => {
            setForm({
              ...form,
              participants: Number(event.target.value),
            });

            clearFieldError("participants");
          }}
        />

        {fieldErrors.participants && (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.participants}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="message">
          Message
        </label>

        <textarea
          id="message"
          rows={4}
          maxLength={1000}
          value={form.message}
          aria-invalid={Boolean(fieldErrors.message)}
          onChange={(event) => {
            setForm({
              ...form,
              message: event.target.value,
            });

            clearFieldError("message");
          }}
        />

        {fieldErrors.message && (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <div>
        <label className={styles.consent}>
          <input
            type="checkbox"
            checked={form.consent}
            aria-invalid={Boolean(fieldErrors.consent)}
            onChange={(event) => {
              setForm({
                ...form,
                consent: event.target.checked,
              });

              clearFieldError("consent");
            }}
          />

          <span>
            J’accepte que mes informations soient utilisées pour
            gérer mon inscription.{" "}
            <span
  className={styles.required}
  aria-hidden="true"
>
  *
</span>
          </span>
        </label>

        {fieldErrors.consent && (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.consent}
          </p>
        )}
      </div>

      {globalError && (
        <p className={styles.error} role="alert">
          {globalError}
        </p>
      )}

      {successMessage && (
        <p className={styles.success} role="status">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Envoi en cours…"
          : "Valider mon inscription"}
      </button>
    </form>
  );
}