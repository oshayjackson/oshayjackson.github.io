import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./TerminalScene.module.css";

type Phase = "idle" | "typing" | "done";

export type TerminalCommand = {
  name: string; // e.g. "help", "open"
  usage?: string; // e.g. "open about"
  description: string;
  run: (args: string[]) => CommandResult;
};

type CommandResult =
  | { lines: string[] }
  | { action: "navigate"; to: string; lines?: string[] }
  | { action: "clear"; lines?: string[] };

type TerminalSceneProps = {
  script: string;

  /** Shows blank terminal before typing starts */
  bootDelayMs?: number;

  /** Base typing delay (ms) */
  baseDelayMs?: number;

  /** Terminal sizing (locked immediately to prevent any initial shrink/FOUC growth) */
  width?: string; // e.g. "min(900px, 92vw)"
  height?: number | string; // e.g. 520 or "clamp(340px, 48vh, 520px)"

  /** If true, clicking the terminal while typing will skip to the end */
  clickToSkip?: boolean;

  /** Show blinking cursor */
  showCursor?: boolean;

  /** Reusable actions slot (Home prompt buttons, Contact links, etc.) */
  actions?: ReactNode;

  /** Optional command mode */
  enableCommands?: boolean;
  commands?: TerminalCommand[];
  onCommandAction?: (
    result: Extract<CommandResult, { action: "navigate" }>
  ) => void;

  /** Called when typing completes or is skipped */
  onDone?: () => void;

  /** aria-label for accessibility */
  ariaLabel?: string;
};

export default function TerminalScene({
  script,
  bootDelayMs = 180,
  baseDelayMs = 16,
  width = "min(900px, 92vw)",
  height = 520,
  clickToSkip = true,
  showCursor = true,
  actions,
  enableCommands = false,
  commands = [],
  onCommandAction,
  onDone,
  ariaLabel = "Terminal scene",
}: TerminalSceneProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [index, setIndex] = useState(0);
  const doneRef = useRef(false);

  // Subtle line-by-line fade when a newline completes.
  const [flashLineIndex, setFlashLineIndex] = useState<number | null>(null);
  const completedNewlinesRef = useRef(0);

  // Runtime output appended after typing completes (command mode)
  const [runtimeLines, setRuntimeLines] = useState<string[]>([]);
  const [cmdValue, setCmdValue] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryPos, setCmdHistoryPos] = useState<number>(-1);

  const scrollRef = useRef<HTMLPreElement | null>(null);

  const terminalStyle: React.CSSProperties = useMemo(
    () => ({
      width,
      minWidth: width, // critical: prevents “tiny terminal then grows” on hard reload
      maxWidth: 900,
      height,
    }),
    [width, height]
  );

  const typedText = script.slice(0, index);

  const fullText = useMemo(() => {
    if (phase === "done" && runtimeLines.length > 0) {
      return [script, "", ...runtimeLines].join("\n");
    }
    return phase === "idle" ? "" : typedText;
  }, [phase, runtimeLines, script, typedText]);

  // Blank terminal first
  useEffect(() => {
    if (phase !== "idle") return;

    const t = window.setTimeout(() => setPhase("typing"), bootDelayMs);
    return () => window.clearTimeout(t);
  }, [phase, bootDelayMs]);

  // Typing effect
  useEffect(() => {
    if (phase !== "typing" || doneRef.current) return;

    const char = script[index];

    const extraDelay =
      char === "\n"
        ? 90
        : char === "."
        ? 70
        : char === "…"
        ? 110
        : char === ","
        ? 40
        : 0;

    const timer = window.setTimeout(() => {
      const next = index + 1;

      // Trigger subtle line fade on newline completion
      if (char === "\n") {
        completedNewlinesRef.current += 1;
        const justFinishedLine = completedNewlinesRef.current - 1;
        setFlashLineIndex(justFinishedLine);
        window.setTimeout(() => setFlashLineIndex(null), 220);
      }

      if (next >= script.length) {
        doneRef.current = true;
        setIndex(script.length);
        setPhase("done");
        onDone?.();
        return;
      }

      setIndex(next);
    }, baseDelayMs + extraDelay);

    return () => window.clearTimeout(timer);
  }, [index, script, phase, baseDelayMs, onDone]);

  const skipTyping = useCallback(() => {
    if (phase !== "typing") return;
    doneRef.current = true;
    setIndex(script.length);
    setPhase("done");
    onDone?.();
  }, [phase, script.length, onDone]);

  const onClickTerminal = useCallback(() => {
    if (!clickToSkip) return;
    skipTyping();
  }, [clickToSkip, skipTyping]);

  // Silent Enter support: skip typing only (no navigation)
  const onTerminalKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (phase === "typing") skipTyping();
    },
    [phase, skipTyping]
  );

  // Auto-scroll terminal text to bottom as it grows (typing or commands)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [fullText, phase]);

  // --- Command handling ------------------------------------------------------

  const commandIndex = useMemo(() => {
    const map = new Map<string, TerminalCommand>();
    for (const c of commands) map.set(c.name.toLowerCase(), c);
    return map;
  }, [commands]);

  const runCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const prefix = `> ${trimmed}`;
      const [name, ...args] = trimmed.split(/\s+/);
      const cmd = commandIndex.get(name.toLowerCase());

      if (!cmd) {
        setRuntimeLines((prev) => [
          ...prev,
          prefix,
          `Unknown command: ${name}`,
          `Type "help" to see available commands.`,
        ]);
        return;
      }

      const result = cmd.run(args);

      if ("action" in result) {
        if (result.action === "navigate") {
          setRuntimeLines((prev) => [...prev, prefix, ...(result.lines ?? [])]);
          onCommandAction?.(result);
          return;
        }

        if (result.action === "clear") {
          // Optional: echo feedback before clearing
          if (result.lines && result.lines.length > 0) {
            setRuntimeLines(result.lines);
          } else {
            setRuntimeLines([]);
          }
          return;
        }
      }

      // Normalize to a definite array (TS-safe even if it thinks lines could be undefined).
      const out: string[] =
        "lines" in result && result.lines ? result.lines : [];
      setRuntimeLines((prev) => [...prev, prefix, ...out]);
    },
    [commandIndex, onCommandAction]
  );

  const onSubmitCommand = useCallback(() => {
    if (phase !== "done") return;
    if (!enableCommands) return;

    const raw = cmdValue;
    const trimmed = raw.trim();
    if (!trimmed) return;

    setCmdHistory((prev) => [trimmed, ...prev].slice(0, 25));
    setCmdHistoryPos(-1);
    setCmdValue("");

    runCommand(trimmed);
  }, [phase, enableCommands, cmdValue, runCommand]);

  const onCommandInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!enableCommands) return;

      if (e.key === "Enter") {
        e.preventDefault();
        onSubmitCommand();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (cmdHistory.length === 0) return;

        const next = Math.min(cmdHistoryPos + 1, cmdHistory.length - 1);
        setCmdHistoryPos(next);
        setCmdValue(cmdHistory[next] ?? "");
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (cmdHistory.length === 0) return;

        const next = cmdHistoryPos - 1;
        if (next < 0) {
          setCmdHistoryPos(-1);
          setCmdValue("");
          return;
        }

        setCmdHistoryPos(next);
        setCmdValue(cmdHistory[next] ?? "");
      }
    },
    [enableCommands, onSubmitCommand, cmdHistory, cmdHistoryPos]
  );

  // --- Render lines with line-by-line fade on completion ---------------------

  const lines = useMemo(() => fullText.split("\n"), [fullText]);

  return (
    <section className={styles.page}>
      <div className={styles.cutscene}>
        <div
          className={`${styles.terminal} ${styles.boot}`}
          style={terminalStyle}
          onClick={onClickTerminal}
          onKeyDown={onTerminalKeyDown}
          role="button"
          tabIndex={0}
          aria-label={ariaLabel}
        >
          <pre className={styles.text} ref={scrollRef}>
            {lines.map((line, i) => {
              const cls =
                flashLineIndex === i
                  ? `${styles.line} ${styles.lineFlash}`
                  : styles.line;

              const safe = line.length === 0 ? "\u00A0" : line;
              const isLast = i === lines.length - 1;

              return (
                <span className={cls} key={`${i}-${line.length}`}>
                  {safe}
                  {showCursor && isLast ? (
                    <span className={styles.cursor} aria-hidden="true">
                      |
                    </span>
                  ) : null}
                  {"\n"}
                </span>
              );
            })}
          </pre>

          <div className={styles.bottom}>
            {actions ? (
              <div className={styles.actions}>{actions}</div>
            ) : (
              <span />
            )}

            {enableCommands && phase === "done" ? (
              <div
                className={styles.commandBar}
                onClick={(e) => e.stopPropagation()}
              >
                <span className={styles.prompt} aria-hidden="true">
                  &gt;
                </span>
                <input
                  className={styles.commandInput}
                  value={cmdValue}
                  onChange={(e) => setCmdValue(e.target.value)}
                  onKeyDown={onCommandInputKeyDown}
                  placeholder='Type "help" or "open about"'
                  spellCheck={false}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                />
                <button
                  type="button"
                  className={styles.commandRun}
                  onClick={onSubmitCommand}
                >
                  Run
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
