import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useTerminalDimensions } from "@opentui/react";
import type { ToastOptions, ToastVariant } from "./types";
import { DEFAULT_DURATION } from "./types";
import { useTheme } from "../theme";

export type ToastContextValue = {
  show: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

type ToastProviderProps = { children: ReactNode };

export function ToastProvider({ children }: ToastProviderProps) {
  const [currentToast, setCurrentToast] = useState<ToastOptions | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback((options: ToastOptions) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const duration = options.duration ?? DEFAULT_DURATION;
    setCurrentToast({ variant: "info", ...options, duration });

    timerRef.current = setTimeout(() => setCurrentToast(null), duration).unref();
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <Toast currentToast={currentToast} />
    </ToastContext.Provider>
  );
}

type ToastProps = { currentToast: ToastOptions | null };

function Toast({ currentToast }: ToastProps) {
  const { width } = useTerminalDimensions();
  const { colors } = useTheme();

  if (!currentToast) return null;

  const borderColor = colors[currentToast.variant ?? "info"];

  return (
    <box
      position="absolute"
      justifyContent="center"
      alignItems="flex-start"
      flexDirection="column"
      gap={1}
      top={2}
      right={2}
      width={Math.max(1, Math.min(60, width - 6))}
      paddingY={1}
      paddingX={2}
      backgroundColor={colors.dialogSurface}
      borderColor={borderColor}
      border={["left", "right"]}
    >
      <text fg="#E1E1E1" wrapMode="word" width="100%">
        {currentToast.message}
      </text>
    </box>
  );
}
