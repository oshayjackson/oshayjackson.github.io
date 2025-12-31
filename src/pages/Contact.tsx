import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TerminalScene, {
  type TerminalCommand,
} from "../components/TerminalScene";
import { buildGlobalCommands } from "../components/terminalCommands";
import useDocumentTitle from "../hooks/useDocumentTitle";
import styles from "./Contact.module.css";

export default function Contact() {
  useDocumentTitle("Contact — Oshay Jackson");
  const navigate = useNavigate();

  const email = "you@example.com";

  const script = useMemo(
    () =>
      [
        "CONTACT",
        "",
        "The most reliable way to reach me is email.",
        "",
        "Click the address below to compose a message.",
      ].join("\n"),
    []
  );

  const [ready, setReady] = useState(false);

  const commands: TerminalCommand[] = useMemo(() => {
    const global = buildGlobalCommands();

    const contactExtras: TerminalCommand[] = [
      {
        name: "email",
        usage: "email",
        description: "Show email address",
        run: () => ({ lines: [email] }),
      },
    ];

    return [...global, ...contactExtras];
  }, [email]);

  return (
    <TerminalScene
      script={script}
      bootDelayMs={180}
      baseDelayMs={16}
      ariaLabel="Contact terminal"
      onDone={() => setReady(true)}
      enableCommands={ready}
      commands={commands}
      onCommandAction={(r) => navigate(r.to)}
      actions={
        <div className={`card ${styles.card}`}>
          <div className={styles.row}>
            <span className={styles.label}>Email</span>
            <a className={styles.value} href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </div>
      }
    />
  );
}
