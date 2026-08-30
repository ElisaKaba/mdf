"use client";

import { useState } from "react";

import styles from "./ContactForm.module.css";

type ContactFormProps = {
  houseSlug: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
  consent: false,
};

export default function ContactForm({
  houseSlug,
}: ContactFormProps) {
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          houseSlug,
          ...form,
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
        data.message ?? "Votre message a bien été envoyé."
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
      <h1>Nous contacter</h1>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="firstName">
            Prénom{" "}
            <span
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
            onChange={(event) => {
              setForm({
                ...form,
                firstName: event.target.value,
              });

              clearFieldError("firstName");
            }}
          />

          {fieldErrors.firstName && (
            <p className={styles.fieldError} role="alert">
              {fieldErrors.firstName}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="lastName">
            Nom{" "}
            <span
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
            onChange={(event) => {
              setForm({
                ...form,
                lastName: event.target.value,
              });

              clearFieldError("lastName");
            }}
          />

          {fieldErrors.lastName && (
            <p className={styles.fieldError} role="alert">
              {fieldErrors.lastName}
            </p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="email">
          Adresse e-mail{" "}
          <span
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
          onChange={(event) => {
            setForm({
              ...form,
              email: event.target.value,
            });

            clearFieldError("email");
          }}
        />

        {fieldErrors.email && (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="subject">
          Sujet{" "}
          <span
            className={styles.required}
            aria-hidden="true"
          >
            *
          </span>
        </label>

        <input
          id="subject"
          type="text"
          value={form.subject}
          aria-invalid={Boolean(fieldErrors.subject)}
          onChange={(event) => {
            setForm({
              ...form,
              subject: event.target.value,
            });

            clearFieldError("subject");
          }}
        />

        {fieldErrors.subject && (
          <p className={styles.fieldError} role="alert">
            {fieldErrors.subject}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="message">
          Message{" "}
        <span
  className={styles.required}
  aria-hidden="true"
>
  *
</span>
        </label>

        <textarea
          id="message"
          rows={6}
          maxLength={2000}
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
            J’accepte que mes informations soient utilisées pour répondre à ma
            demande.{" "}
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
        {isSubmitting ? "Envoi en cours…" : "Envoyer"}
      </button>
    </form>
  );
}