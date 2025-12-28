import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className="h1">Projects</h1>
        <p className="lead">
          Selected work with clear scope, decisions, and outcomes.
        </p>
      </header>

      <div className={styles.grid}>
        <article className={`card ${styles.card}`}>
          <h2 className={styles.h2}>Project Title</h2>
          <p className={styles.p}>
            Problem → approach → result. Add links and metrics.
          </p>
        </article>

        <article className={`card ${styles.card}`}>
          <h2 className={styles.h2}>Project Title</h2>
          <p className={styles.p}>
            Highlight scale, reliability, performance, or DX improvements.
          </p>
        </article>
      </div>
    </section>
  );
}
