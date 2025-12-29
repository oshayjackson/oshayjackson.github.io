import { Link } from "react-router-dom";
import type { Project } from "../../content/projects";
import styles from "./ProjectCard.module.css";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  return (
    <article className={`card ${styles.card}`}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <Link to={`/projects/${project.slug}`} className={styles.titleLink}>
            {project.title}
          </Link>
        </h2>

        {project.status ? (
          <span className={styles.badge}>{project.status}</span>
        ) : null}
      </header>

      <p className={styles.summary}>{project.summary}</p>

      <ul className={styles.stack}>
        {project.stack.map((t) => (
          <li key={t} className={styles.tag}>
            {t}
          </li>
        ))}
      </ul>

      <ul className={styles.highlights}>
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <div className={styles.links}>
        <Link to={`/projects/${project.slug}`} className={styles.cta}>
          Read case study →
        </Link>

        {project.links?.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            {l.label}
          </a>
        ))}
      </div>
    </article>
  );
}
