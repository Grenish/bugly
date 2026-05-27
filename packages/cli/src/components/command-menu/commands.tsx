import type { Command } from "./types";

export const COMMANDS: Command[] = [
  {
    name: "new",
    description: "Start a fresh conversation",
    value: "/new",
  },
  {
    name: "login",
    description: "Sign in with your API key or credentials",
    value: "/login",
  },
  {
    name: "logout",
    description: "Sign out and clear saved credentials",
    value: "/logout",
  },
  {
    name: "models",
    description: "Switch between available AI models",
    value: "/models",
  },
  {
    name: "background",
    description: "Change the terminal background art",
    value: "/background",
  },
  {
    name: "providers",
    description: "Select AI provider and manage your API keys",
    value: "/providers",
  },
  {
    name: "mode",
    description: "Toggle between agent modes (auto, plan, ask)",
    value: "/mode",
  },
  {
    name: "dumbo",
    description: "Caveman mode: code-only responses, no explanations",
    value: "/dumbo",
  },
  {
    name: "marketplace",
    description: "Install skills, MCPs, themes, and other add-ons",
    value: "/marketplace",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Marketplace",
        description: "Install skills, MCPs, themes and other add-ons to bugly.",
        children: <text>Work in progress...</text>,
      });
    },
  },
  {
    name: "keybindings",
    description: "View and customize CLI keyboard shortcuts",
    value: "/keybindings",
  },
  {
    name: "exit",
    description: "Close the application",
    value: "/bye",
    action: (ctx) => {
      ctx.exit();
    },
  },
];
