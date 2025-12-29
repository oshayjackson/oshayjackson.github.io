import { useParams, Link } from "react-router-dom";

export default function ProjectDetail() {
  const { slug } = useParams();

  return (
    <section>
      <Link to="/projects">← Back to Projects</Link>
      <h1 className="h1" style={{ marginTop: 12 }}>
        {slug}
      </h1>
      <p className="lead">Case study content coming next.</p>
    </section>
  );
}
