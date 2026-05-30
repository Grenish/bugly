import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";

type Props = {
  message: string;
};

export function UserMessage({ message }: Props) {
  const { colors } = useTheme();

  return (
    <box width={"100%"} alignItems="center">
      <box width={"100%"}>
        <box
          backgroundColor={colors.dimSeparator}
          justifyContent="center"
          paddingX={2}
          paddingY={1}
          width={"100%"}
        >
          <text>{message}</text>
        </box>
      </box>
    </box>
  );
}
