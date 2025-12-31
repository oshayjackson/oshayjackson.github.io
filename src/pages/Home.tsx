import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TerminalScene, {
  type TerminalCommand,
} from "../components/TerminalScene";
import useDocumentTitle from "../hooks/useDocumentTitle";
import styles from "./Home.module.css";

type Phase = "typing" | "prompt" | "cleared";

export default function Home() {
  useDocumentTitle("Oshay Jackson");
  const navigate = useNavigate();

  const script = useMemo(
    () =>
      [
        "Initializing environment…",
        "Loading background scene…",
        "",
        "Welcome.",
        "This site is a living portfolio—case studies, decisions, tradeoffs, and outcomes.",
        "Explore projects like files. Open write-ups like windows.",
        "",
        "Learn more about me?",
      ].join("\n"),
    []
  );

  const [phase, setPhase] = useState<Phase>("typing");

  const clearAndNavigate = useCallback(
    (to: "/about" | "/projects" | "/contact") => {
      setPhase("cleared");
      window.setTimeout(() => navigate(to), 220);
    },
    [navigate]
  );

  const stopBubble = (e: React.MouseEvent) => e.stopPropagation();

  const commands: TerminalCommand[] = useMemo(
    () => [
      {
        name: "help",
        usage: "help",
        description: "List available commands",
        run: () => ({
          lines: [
            "Available commands:",
            "  help                 - show this list",
            "  open about           - navigate to About",
            "  open projects        - navigate to Projects",
            "  open contact         - navigate to Contact",
          ],
        }),
      },
      {
        name: "open",
        usage: "open <about|projects|contact>",
        description: "Navigate to a page",
        run: (args: string[]) => {
          const target = (args[0] ?? "").toLowerCase();

          const map: Record<string, string> = {
            about: "/about",
            projects: "/projects",
            contact: "/contact",
          };

          const to = map[target];
          if (!to) {
            return {
              lines: ["Usage: open about | open projects | open contact"],
            };
          }

          return { action: "navigate", to, lines: [`Opening ${target}…`] };
        },
      },
    ],
    []
  );

  if (phase === "cleared") {
    return <div className={styles.cleared} />;
  }

  return (
    <TerminalScene
      script={script}
      bootDelayMs={450} // home feels more cinematic
      baseDelayMs={42} // slower, calm pacing
      ariaLabel="Home intro terminal"
      onDone={() => setPhase("prompt")}
      actions={
        phase === "prompt" ? (
          <div className={styles.promptRow} onClick={stopBubble}>
            <button
              type="button"
              className="btn btnPrimary"
              onClick={() => clearAndNavigate("/about")}
            >
              Yes
            </button>

            <button
              type="button"
              className="btn btnGhost"
              onClick={() => clearAndNavigate("/projects")}
            >
              No, take me to Projects
            </button>
          </div>
        ) : null
      }
      enableCommands={phase === "prompt"}
      commands={commands}
      onCommandAction={(r) => {
        // Click-based flow still wins; commands are optional.
        // If you want the same clear-fade transition for commands too, call clearAndNavigate instead.
        navigate(r.to);
      }}
    />
  );
}
