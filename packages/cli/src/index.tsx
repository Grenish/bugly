import { createCliRenderer, TextAttributes } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";
import { Background } from "./components/background";
import { ToastProvider } from "./providers/toast";
import { KeyboardLayerProvider } from "./providers/keyboard-layer";
import { DialogProvider } from "./providers/dialog";
import { ThemeProvider, useTheme } from "./providers/theme";

function ThemeRoot() {
  const { colors } = useTheme();
  const name = "John";

  return (
    <box
      alignItems="center"
      backgroundColor={colors.background}
      justifyContent="center"
      width={"100%"}
      height={"100%"}
      gap={2}
    >
      <Background />
      <Header />
      <box width={"100%"} maxWidth={80} paddingX={2}>
        <box paddingX={1} flexDirection="row" gap={1}>
          <text>Hello</text>
          <text fg={"gray"}>{name}</text>
          <text>What are we fixing today?</text>
        </box>
        <InputBar onSubmit={() => {}} />
      </box>
    </box>
  );
}

function App() {
  return (
    <ThemeProvider>
      <KeyboardLayerProvider>
        <DialogProvider>
          <ToastProvider>
            <ThemeRoot />
          </ToastProvider>
        </DialogProvider>
      </KeyboardLayerProvider>
    </ThemeProvider>
  );
}

const renderer = await createCliRenderer({
  targetFps: 60,
  exitOnCtrlC: false,
});
createRoot(renderer).render(<App />);
