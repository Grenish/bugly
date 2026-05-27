import { useRef, useState, useMemo, useCallback, useEffect, type RefObject } from "react";
import { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { getFilteredCommands } from "./filter-command";
import type { Command } from "./types";
import { useKeyboardLayer } from "../../providers/keyboard-layer";

type UseCommandMenuReturn = {
  showCommandMenu: boolean;
  commandQuery: string;
  selectedIndex: number;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
  handleContentChange: (text: string) => void;
  resolveCommand: (index: number) => Command | undefined;
  setSelectedIndex: (index: number) => void;
};

export function useCommandMenu(): UseCommandMenuReturn {
  const [textValue, setTextValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const scrollRef = useRef<ScrollBoxRenderable | null>(null);
  const { push, pop, isTopLayer } = useKeyboardLayer();

  // showCommandMenu is only true when text starts with "/", so the startsWith guard is redundant
  const commandQuery = showCommandMenu ? textValue.slice(1) : "";

  const filteredCommands = useMemo(() => getFilteredCommands(commandQuery), [commandQuery]);

  // Layer registration

  const close = () => {
    setShowCommandMenu(false);
    pop("command");
  }

  const closeMenu = useCallback(() => {
    close()
    return true;
  }, [pop]);

  useEffect(() => {
    if (showCommandMenu) {
      push("command", closeMenu);
    } else {
      pop("command");
    }
    return () => pop("command");
  }, [showCommandMenu, push, pop, closeMenu]);

  // Handlers

  const handleContentChange = useCallback((text: string) => {
    setTextValue(text);
    setSelectedIndex(0);

    const scrollBox = scrollRef.current;
    if (scrollBox) scrollBox.scrollTo(0);

    const isCommand = text.startsWith("/") && !text.slice(1).includes(" ");
    setShowCommandMenu(isCommand);
  }, []);

  const resolveCommand = useCallback((index: number): Command | undefined => {
    const command = filteredCommands[index];
    if (command) {
      close();
    }
    return command;
  }, [filteredCommands, pop]);

  // Keyboard

  useKeyboard((key) => {
    if (!showCommandMenu || !isTopLayer("command")) return;

    if (key.name === "escape") {
      key.preventDefault();
      closeMenu();
      return;
    }

    if (key.name === "up") {
      key.preventDefault();
      setSelectedIndex((i) => {
        const newIndex = Math.max(0, i - 1);
        const sb = scrollRef.current;
        if (sb && newIndex < sb.scrollTop) sb.scrollTo(newIndex);
        return newIndex;
      });
      return;
    }

    if (key.name === "down") {
      key.preventDefault();
      setSelectedIndex((i) => {
        if (filteredCommands.length === 0) return 0;

        const newIndex = Math.min(filteredCommands.length - 1, i + 1);
        const sb = scrollRef.current;
        if (sb) {
          const visibleEnd = sb.scrollTop + sb.viewport.height - 1;
          if (newIndex > visibleEnd) {
            sb.scrollTo(newIndex - sb.viewport.height + 1);
          }
        }
        return newIndex;
      });
    }
  });

  return {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  };
}
