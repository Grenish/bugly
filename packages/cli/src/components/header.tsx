import { useTheme } from "../providers/theme";

export function Header() {
  const { colors } = useTheme();
  return (
    <box justifyContent="center" alignItems="center">
      <box flexDirection="column" justifyContent="center" gap={1} alignItems="center">
        <box flexDirection="row" justifyContent="center" gap={1}>
          <ascii-font font="tiny" text="bug" color={colors.dimSeparator} />
          <ascii-font font="tiny" text="ly" color={colors.primary} />
        </box>
      </box>
    </box>
  );
}
