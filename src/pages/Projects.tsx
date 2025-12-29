import styles from "./Projects.module.css";
import { projects } from "../content/projects";
import ProjectCard from "../components/projects/ProjectCard";

export default function Projects() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className="h1">Projects</h1>
        <p className="lead">Selected work with dedicated case studies.</p>
      </header>

      <div className={styles.grid}>
        {projects.map((p) => (
          <div key={p.slug} className={styles.col}>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
