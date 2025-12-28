import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section className={styles.page}>
      <h1 className="h1">Contact</h1>
      <p className="lead">The most reliable way to reach me is email.</p>

      <div className={`card ${styles.card}`}>
        <div className={styles.row}>
          <span className={styles.label}>Email</span>
          <a className={styles.value} href="mailto:you@example.com">
            you@example.com
          </a>
        </div>
      </div>
    </section>
  );
}
