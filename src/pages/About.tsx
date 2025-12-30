import styles from "./About.module.css";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function About() {
  useDocumentTitle("About — Oshay Jackson");

  return (
    <section className={styles.page}>
      <h1 className="h1">About</h1>
      <p className="lead">
        I build reliable systems and polished user experiences, with a focus on
        clarity, maintainability, and performance.
      </p>

      <div className={`card ${styles.card}`}>
        <h2 className={styles.h2}>Focus</h2>
        <ul className={styles.list}>
          <li>Distributed systems and backend services</li>
          <li>AWS, automation, and developer experience</li>
          <li>Performance, observability, reliability</li>
        </ul>
      </div>
    </section>
  );
}
