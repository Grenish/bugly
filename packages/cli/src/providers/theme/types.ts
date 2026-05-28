export type ThemeColors = {
  primary: string;
  planMode: string;
  selected: string;
  thinking: string;
  success: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  dialogSurface: string;
  thinkingBorder: string;
  dimSeparator: string;
  backdropLogo: string;
};

export type Theme = {
  name: string;
  from: string;
  colors: ThemeColors;
};

export const Themes: Theme[] = [
  {
    name: "bugly",
    from: "bugly",
    colors: {
      primary: "#56D6C2",
      planMode: "#89B4FA",
      selected: "#89B4FA",
      thinking: "#CBA6F7",
      thinkingBorder: "#CBA6F7",
      success: "#82E0AA",
      error: "#E74C5E",
      info: "#56D6C2",
      background: "#0D0D12",
      surface: "#1A1A24",
      dialogSurface: "#1A1A1A",
      dimSeparator: "#4A4A60",
      backdropLogo: "#C0C0D0",
    },
  },
  {
    name: "Lily",
    from: "bugly",
    colors: {
      primary: "#E8A2C4",
      planMode: "#F0C080",
      selected: "#C4A0E0",
      thinking: "#80C4D8",
      thinkingBorder: "#80C4D8",
      success: "#94D4A4",
      error: "#D87878",
      info: "#E8A2C4",
      background: "#0C0A0E",
      surface: "#1A1420",
      dialogSurface: "#150F1A",
      dimSeparator: "#453058",
      backdropLogo: "#C890B0",
    },
  },
  {
    name: "Avocado",
    from: "bugly",
    colors: {
      primary: "#A8C870",
      planMode: "#D4A84B",
      selected: "#7BAF50",
      thinking: "#C8B87A",
      thinkingBorder: "#C8B87A",
      success: "#B8D878",
      error: "#C87850",
      info: "#A8C870",
      background: "#0A0D08",
      surface: "#141A0E",
      dialogSurface: "#111408",
      dimSeparator: "#3A4E28",
      backdropLogo: "#B0C890",
    },
  },
];

export const DEFAULT_THEME = Themes.find((t) => t.name === "bugly")!;
