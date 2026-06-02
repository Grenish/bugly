import z from "zod";

export const taskStatusSchema = z.enum(["Working", "Queued", "Complete"]);

export const crewTaskSchema = z.object({
  taskDesc: z.string(),
  status: taskStatusSchema,
});

export const toolCallArgsSchema = z.record(z.string(), z.json());

export const reasoningMessagePartSchema = z.object({
  type: z.literal("reasoning"),
  text: z.string(),
});

export const toolCallMessagePartSchema = z.object({
  type: z.literal("tool-call"),
  toolCallId: z.string(),
  toolName: z.string(),
  args: toolCallArgsSchema,
  result: z.string().optional(),
});

export const crewMessagePartSchema = z.object({
  type: z.literal("crew"),
  description: z.string(),
  tasks: z.array(crewTaskSchema),
});

export const textMessagePartSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

export const messagePartSchema = z.discriminatedUnion("type", [
  reasoningMessagePartSchema,
  toolCallMessagePartSchema,
  crewMessagePartSchema,
  textMessagePartSchema,
]);

export const messagePartsSchema = z.array(messagePartSchema);

export const textDeltaStreamEventSchema = z.object({
  type: z.literal("text-delta"),
  text: z.string(),
});

export const reasoningDeltaStreamEventSchema = z.object({
  type: z.literal("reasoning-delta"),
  text: z.string(),
});

export const toolCallStreamEventSchema = z.object({
  type: z.literal("tool-call"),
  toolCallId: z.string(),
  toolName: z.string(),
  args: toolCallArgsSchema,
});

export const toolResultStreamEventSchema = z.object({
  type: z.literal("tool-result"),
  toolCallId: z.string(),
  result: z.string(),
});

export const doneStreamEventSchema = z.object({
  type: z.literal("done"),
  messageId: z.string(),
  durationMs: z.number(),
});

export const errorStreamEventSchema = z.object({
  type: z.literal("error"),
  message: z.string(),
});

export const chatStreamEventSchema = z.discriminatedUnion("type", [
  textDeltaStreamEventSchema,
  reasoningDeltaStreamEventSchema,
  toolCallStreamEventSchema,
  toolResultStreamEventSchema,
  doneStreamEventSchema,
  errorStreamEventSchema,
]);

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type CrewTask = z.infer<typeof crewTaskSchema>;
export type ToolCallArgs = z.infer<typeof toolCallArgsSchema>;

export type ReasoningMessagePart = z.infer<typeof reasoningMessagePartSchema>;
export type ToolCallMessagePart = z.infer<typeof toolCallMessagePartSchema>;
export type CrewMessagePart = z.infer<typeof crewMessagePartSchema>;
export type TextMessagePart = z.infer<typeof textMessagePartSchema>;
export type MessagePart = z.infer<typeof messagePartSchema>;
export type MessageParts = z.infer<typeof messagePartsSchema>;

export type TextDeltaStreamEvent = z.infer<typeof textDeltaStreamEventSchema>;
export type ReasoningDeltaStreamEvent = z.infer<typeof reasoningDeltaStreamEventSchema>;
export type ToolCallStreamEvent = z.infer<typeof toolCallStreamEventSchema>;
export type ToolResultStreamEvent = z.infer<typeof toolResultStreamEventSchema>;
export type DoneStreamEvent = z.infer<typeof doneStreamEventSchema>;
export type ErrorStreamEvent = z.infer<typeof errorStreamEventSchema>;
export type ChatStreamEvent = z.infer<typeof chatStreamEventSchema>;
