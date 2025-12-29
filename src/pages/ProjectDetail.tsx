import { Link, useParams } from "react-router-dom";
import { projects } from "../content/projects";
import styles from "./ProjectDetail.module.css";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <section className={styles.page}>
        <Link to="/projects" className={styles.back}>
          ← Back to Projects
        </Link>

        <div className={styles.titleBlock}>
          <h1 className="h1">Project not found</h1>
          <p className="lead">The project you’re looking for doesn’t exist.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <Link to="/projects" className={styles.back}>
        ← Back to Projects
      </Link>

      <div className={styles.titleBlock}>
        <h1 className="h1">{project.title}</h1>
        <p className="lead">{project.summary}</p>
      </div>

      <div className={styles.sections}>
        <div className={`card ${styles.sectionCard}`}>
          <h2 className={styles.h2}>Highlights</h2>
          <ul className={styles.list}>
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>

        <div className={`card ${styles.sectionCard}`}>
          <h2 className={styles.h2}>Tech Stack</h2>
          <ul className={styles.tags}>
            {project.stack.map((t) => (
              <li key={t} className={styles.tag}>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {project.links?.length ? (
          <div className={`card ${styles.sectionCard}`}>
            <h2 className={styles.h2}>Links</h2>
            <div className={styles.links}>
              {project.links.map((l) => (
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
          </div>
        ) : null}
      </div>
    </section>
  );
}
