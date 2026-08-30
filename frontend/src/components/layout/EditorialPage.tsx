import Image from "next/image";

import styles from "./EditorialPage.module.css";

type EditorialPageProps = {
  title: string;
  frenchContent: string;
  basqueContent: string;
};

export default function EditorialPage({
  title,
  frenchContent,
  basqueContent,
}: EditorialPageProps) {
  return (
    <section className={styles.wrapper}>
 <Image
  src="/images/carre-vertical-200.png"
  alt=""
  width={220}
  height={220}
  className={styles.logo}
/>
      <h1>{title}</h1>

      <div className={styles.columns}>
        <article>
          <h2>Français</h2>
          <p>{frenchContent}</p>
        </article>

        <article>
          <h2>Euskara</h2>
          <p>{basqueContent}</p>
        </article>
      </div>
    </section>
  );
}