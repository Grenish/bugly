import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_THEME, type ThemeColors, type Theme, Themes } from "./types";

const BUGLY_HOME = process.env.BUGLY_HOME || join(homedir(), ".bugly");
const CONFIG_PATH = join(BUGLY_HOME, "config.json");
const LEGACY_PREFERENCES_PATH = join(BUGLY_HOME, "preferences.json");

type BuglyConfig = {
  theme?: {
    name?: string;
    from?: string;
  };
  themeName?: string;
  [key: string]: unknown;
};

function findTheme(config: BuglyConfig): Theme {
  const themeName = config.theme?.name ?? config.themeName;
  const themeFrom = config.theme?.from;

  return (
    Themes.find(
      (theme) => theme.name === themeName && (themeFrom === undefined || theme.from === themeFrom)
    ) ?? DEFAULT_THEME
  );
}

function readConfigFile(path: string): BuglyConfig | null {
  try {
    const config = JSON.parse(readFileSync(path, "utf-8"));
    if (!config || typeof config !== "object" || Array.isArray(config)) {
      return null;
    }
    return config as BuglyConfig;
  } catch {
    return null;
  }
}

function readConfig(): BuglyConfig {
  return readConfigFile(CONFIG_PATH) ?? readConfigFile(LEGACY_PREFERENCES_PATH) ?? {};
}

function writeConfig(config: BuglyConfig) {
  try {
    mkdirSync(BUGLY_HOME, { recursive: true });
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  } catch {
    // Ignore config write failures so theme switching still works for this session.
  }
}

function getInitialTheme(): Theme {
  return findTheme(readConfig());
}

function persistTheme(theme: Theme) {
  writeConfig({
    ...readConfig(),
    theme: {
      name: theme.name,
      from: theme.from,
    },
  });
}

type ThemeContextValue = {
  colors: ThemeColors;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be within a ThemeProvider");
  }
  return value;
}

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    persistTheme(theme);
  }, []);

  const value = useMemo(
    () => ({ colors: currentTheme.colors, currentTheme, setTheme }),
    [currentTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
