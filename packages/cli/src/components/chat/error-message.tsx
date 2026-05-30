import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";

type Props = {
  message: string;
  description: string;
};

export function ErrorMessage({ message, description }: Props) {
  const { colors } = useTheme();

  return (
    <box width={"100%"} alignItems="center">
      <box width={"100%"}>
        <box
          backgroundColor={colors.toastErrorBackground}
          flexDirection="row"
          gap={2}
          paddingX={2}
          paddingY={1}
          width={"100%"}
        >
          <text fg={colors.error}></text>
          <box flexDirection="column">
            <text attributes={TextAttributes.BOLD} fg={colors.toastErrorForeground}>
              {message}
            </text>
            <text attributes={TextAttributes.DIM}>{description}</text>
          </box>
        </box>
      </box>
    </box>
  );
}
