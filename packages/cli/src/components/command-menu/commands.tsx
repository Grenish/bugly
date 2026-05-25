import type { Command } from "./types";

export const COMMANDS: Command[] = [
  {
    name: "new",
    description: "Start a new conversation",
    value: "/new"
  },
  {
    name: "login",
    description: "Login to your account",
    value: "/login"
  },
  {
    name: "logout",
    description: "Logout from your account",
    value: "/logout"
  },
  {
    name: "models",
    description: "Select AI models",
    value: "/models"
  },
  {
    name: "providers",
    description: "Select AI providers (BYOK)",
    value: "/providers"
  },
  {
    name: "mode",
    description: "Agent modes",
    value: "/mode"
  },
  {
    name: "dumbo",
    description: "Caveman mode - only code, no talk",
    value: "/dumbo"
  },
  {
    name: "exit",
    description: "Quit the application",
    value: "/bye",
    action: (ctx) => {
      ctx.exit();
    }
  }
]
