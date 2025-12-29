import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";
import styles from "./App.module.css";
import ProjectDetail from "./pages/ProjectDetail";

export default function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <NavLink to="/" className={styles.brand}>
            Oshay Jackson
          </NavLink>

          <nav className={styles.nav}>
            <NavLink to="/" end className={styles.link}>
              Home
            </NavLink>
            <NavLink to="/projects" className={styles.link}>
              Projects
            </NavLink>
            <NavLink to="/about" className={styles.link}>
              About
            </NavLink>
            <NavLink to="/contact" className={styles.link}>
              Contact
            </NavLink>
          </nav>
        </div>
      </header>

      <main className={`container ${styles.main}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </main>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <span>© {new Date().getFullYear()} Oshay Jackson</span>
          <div className={styles.footerLinks}>
            <a
              href="https://github.com/oshayjackson"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a href="mailto:you@example.com">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
