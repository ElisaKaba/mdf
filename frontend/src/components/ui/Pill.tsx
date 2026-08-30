import styles from "./Pill.module.css";

type PillProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

export default function Pill({
  label,
  active = false,
  onClick,
}: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.pill} ${
        active ? styles.active : ""
      }`}
    >
      {label}
    </button>
  );
}