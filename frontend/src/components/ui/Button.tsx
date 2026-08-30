import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  disabled = false,
}: ButtonProps) {
  const classes = `
    ${styles.button}
    ${styles[variant]}
    ${disabled ? styles.disabled : ""}
    ${className}
  `;

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  );
}