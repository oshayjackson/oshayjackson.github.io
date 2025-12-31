import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TerminalScene from "../components/TerminalScene";
import { buildGlobalCommands } from "../components/terminalCommands";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function About() {
  useDocumentTitle("About — Oshay Jackson");
  const navigate = useNavigate();

  const script = useMemo(
    () =>
      [
        "ABOUT",
        "",
        "I build reliable systems and polished user experiences,",
        "with a focus on clarity, maintainability, and performance.",
        "",
        "FOCUS",
        "- Distributed systems and backend services",
        "- AWS, automation, and developer experience",
        "- Performance, observability, reliability",
      ].join("\n"),
    []
  );

  const commands = useMemo(() => buildGlobalCommands(), []);
  const [ready, setReady] = useState(false);

  return (
    <TerminalScene
      script={script}
      bootDelayMs={180}
      baseDelayMs={16}
      ariaLabel="About terminal"
      onDone={() => setReady(true)}
      enableCommands={ready}
      commands={commands}
      onCommandAction={(r) => navigate(r.to)}
    />
  );
}
