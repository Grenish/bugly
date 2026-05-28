import { useCallback, useEffect, useRef } from "react";
import { useDialog } from "../dialog";
import { useTheme } from ".";
import { DialogSearchList } from "../../components/dialog-search-list";
import { Themes, type Theme } from "./types";

export const ThemeDialogContent = () => {
  const dialog = useDialog();
  const { setTheme, currentTheme } = useTheme();
  const appliedThemeRef = useRef(currentTheme);
  const confirmedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (!confirmedRef.current) {
        setTheme(appliedThemeRef.current);
      }
    };
  }, [setTheme]);

  const handleSelect = useCallback(
    (theme: Theme) => {
      confirmedRef.current = true;
      setTheme(theme);
      dialog.close();
    },
    [setTheme, dialog]
  );

  const handleHighlightTheme = useCallback(
    (theme: Theme) => {
      setTheme(theme);
    },
    [setTheme]
  );
  return (
    <DialogSearchList
      items={Themes}
      onSelect={handleSelect}
      onHighlight={handleHighlightTheme}
      filterFn={(t, query) => t.name.toLowerCase().includes(query.toLowerCase())}
      renderItem={(theme, isSelected) => (
        <box flexDirection="row" gap={1} width="100%">
          <text selectable={false} fg={isSelected ? "black" : "white"}>
            {theme.name === appliedThemeRef.current.name ? "" : ""}
          </text>
          <text selectable={false} fg={isSelected ? "black" : "white"}>
            {theme.name}
          </text>
        </box>
      )}
      getKey={(t) => t.name}
      placeholder="Search items..."
      emptyText="No matching themes"
    />
  );
};
