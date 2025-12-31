import type { TerminalCommand } from "./TerminalScene";

export function buildGlobalCommands(): TerminalCommand[] {
  return [
    {
      name: "help",
      usage: "help",
      description: "List available commands",
      run: () => ({
        lines: [
          "Available commands:",
          "  help                 - show this list",
          "  clear                - clear the terminal",
          "  home                 - return to the Home page",
          "  open about           - navigate to About",
          "  open projects        - navigate to Projects",
          "  open contact         - navigate to Contact",
        ],
      }),
    },
    {
      name: "clear",
      usage: "clear",
      description: "Clear the terminal output",
      run: () => ({
        action: "clear",
      }),
    },
    {
      name: "home",
      usage: "home",
      description: "Return to the Home terminal",
      run: () => ({
        action: "navigate",
        to: "/",
        lines: ["Returning home…"],
      }),
    },
    {
      name: "open",
      usage: "open <about|projects|contact>",
      description: "Navigate to a page",
      run: (args: string[]) => {
        const target = (args[0] ?? "").toLowerCase();

        const map: Record<string, string> = {
          home: "/",
          about: "/about",
          projects: "/projects",
          contact: "/contact",
        };

        const to = map[target];
        if (!to) {
          return {
            lines: [
              "Usage: open home | open about | open projects | open contact",
            ],
          };
        }

        return {
          action: "navigate",
          to,
          lines: [`Opening ${target}…`],
        };
      },
    },
  ];
}
