import styles from "./Home.module.css";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Home() {
  useDocumentTitle("Oshay Jackson");

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <h1 className="h1">Software Development Engineer</h1>
        <p className="lead">
          Portfolio showcasing selected projects and technical case studies,
          built with full UI control.
        </p>

        <div className={styles.ctaRow}>
          <a className="btn btnPrimary" href="#/projects">
            View Projects
          </a>
          <a className="btn btnGhost" href="#/contact">
            Contact
          </a>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={`card ${styles.card}`}>
          <h2 className={styles.h2}>Featured Work</h2>
          <p className={styles.p}>
            Case studies with architecture, tradeoffs, and outcomes.
          </p>
        </div>
        <div className={`card ${styles.card}`}>
          <h2 className={styles.h2}>Engineering Focus</h2>
          <p className={styles.p}>
            Maintainability, performance, reliability, and developer experience.
          </p>
        </div>
      </div>
    </section>
  );
}
