import { TextAttributes } from "@opentui/core";
import "opentui-spinner/react";
import { useTheme } from "../../providers/theme";
import type { ThemeColors } from "../../providers/theme/types";
import { Border } from "../border";

export type TaskStatus = "Working" | "Queued" | "Complete";

export type AgentTask = {
  taskDesc: string;
  status: TaskStatus;
};

type AgentGroupProps = {
  description: string;
  tasks: AgentTask[];
};

type TaskRowProps = {
  task: AgentTask;
  colors: ThemeColors;
};

const TASK_SPINNER_NAME = "dots4";

function TaskStatusIndicator({ status, colors }: { status: TaskStatus; colors: ThemeColors }) {
  if (status === "Complete") {
    return <text fg={colors.success}></text>;
  } else if (status === "Queued") {
    return <text fg={colors.dimSeparator}></text>;
  }

  return <spinner name={TASK_SPINNER_NAME} color={colors.backdropLogo} />;
}

function TaskRow({ task, colors }: TaskRowProps) {
  return (
    <box flexDirection="row" gap={1}>
      <TaskStatusIndicator status={task.status} colors={colors} />
      <text attributes={TextAttributes.DIM}>{task.taskDesc}</text>
    </box>
  );
}

export function AgentGroup({ description, tasks }: AgentGroupProps) {
  const { colors } = useTheme();

  return (
    <box width="100%">
      <Border
        width="95%"
        backgroundColor={colors.background}
        margin="auto"
        borderColor={colors.planMode}
        paddingX={1}
      >
        <box flexDirection="column" width="100%">
          <box>
            <text attributes={TextAttributes.DIM} fg={colors.backdropLogo}>
              {description}
            </text>
          </box>

          <box flexDirection="column">
            {tasks.map((task, index) => (
              <TaskRow
                key={`${task.status}-${task.taskDesc}-${index}`}
                task={task}
                colors={colors}
              />
            ))}
          </box>
        </box>
      </Border>
    </box>
  );
}
