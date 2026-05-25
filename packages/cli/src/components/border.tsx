import type { BorderCharacters, BorderSides } from "@opentui/core";
import type { BoxProps } from "@opentui/react";

// Derive ReactNode from BoxProps so we don't need a direct @types/react import
type ReactNode = BoxProps["children"];

// ─── Types ───────────────────────────────────────────────────────────────────

export type BorderPosition = "left" | "right" | "top" | "bottom" | "all";
export type BorderStyleOption = "line" | "dot";

/**
 * Accepted color formats:
 *   - Hex:      "#1A2B3C"
 *   - RGBA:     "rgba(26, 43, 60, 1)"
 *   - Gradient: "gradient(#hex1, #hex2)"  →  resolved to midpoint color
 *               (terminal cells are single-color; gradient is approximated)
 */
export type BorderColorInput = string;

export type BorderProps = Omit<
  BoxProps,
  "border" | "borderStyle" | "borderColor" | "customBorderChars" | "position"
> & {
  /** Which sides to draw. Defaults to "all". */
  position?: BorderPosition | BorderPosition[];
  /** Hex, rgba string, or gradient(#hex1, #hex2). */
  borderColor?: BorderColorInput;
  /**
   * Thickness in border-box layers. Each unit adds one concentric box border.
   * Defaults to 1.
   */
  borderWidth?: number;
  /** Character set to use. "line" uses box-drawing chars, "dot" uses ·. */
  borderStyle?: BorderStyleOption;
};

// ─── Character sets ──────────────────────────────────────────────────────────

const LINE_CHARS: BorderCharacters = {
  topLeft: "┌",
  topRight: "┐",
  bottomLeft: "└",
  bottomRight: "┘",
  horizontal: "─",
  vertical: "│",
  topT: "┬",
  bottomT: "┴",
  leftT: "├",
  rightT: "┤",
  cross: "┼",
};

// · (U+00B7) is a single-width middle dot — safe for terminal cell rendering
const DOT_CHARS: BorderCharacters = {
  topLeft: "·",
  topRight: "·",
  bottomLeft: "·",
  bottomRight: "·",
  horizontal: "·",
  vertical: "·",
  topT: "·",
  bottomT: "·",
  leftT: "·",
  rightT: "·",
  cross: "·",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Parses "gradient(#aabbcc, #ddeeff)" and returns the midpoint hex color. */
function resolveColor(color: string): string {
  const gradientMatch = color.match(
    /^gradient\(\s*(#[0-9a-fA-F]{6})\s*,\s*(#[0-9a-fA-F]{6})\s*\)$/i,
  );
  if (gradientMatch) {
    return lerpHex(gradientMatch[1]!, gradientMatch[2]!, 0.5);
  }
  return color;
}

function lerpHex(hex1: string, hex2: string, t: number): string {
  const parse = (h: string): [number, number, number] => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(hex1);
  const [r2, g2, b2] = parse(hex2);
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(lerp(r1, r2))}${hex(lerp(g1, g2))}${hex(lerp(b1, b2))}`;
}

function resolveSides(
  position: BorderPosition | BorderPosition[],
): boolean | BorderSides[] {
  const positions = Array.isArray(position) ? position : [position];
  if (positions.includes("all")) return true;
  return positions.filter(
    (p): p is Exclude<BorderPosition, "all"> => p !== "all",
  );
}

// Component

/**
 * A composable border wrapper for OpenTUI boxes.
 *
 * @example
 * // Cyan line border on all sides
 * <Border borderColor="#00FFFF">
 *   <text>Hello</text>
 * </Border>
 *
 * @example
 * // Dot-style left border only, 2 layers thick
 * <Border position="left" borderStyle="dot" borderWidth={2} borderColor="#FF6B6B">
 *   <text>Item</text>
 * </Border>
 *
 * @example
 * // Gradient border (resolved to midpoint color)
 * <Border borderColor="gradient(#00FFFF, #FF00FF)" width={"100%"}>
 *   <textarea placeholder="What are we fixing today?" />
 * </Border>
 */
export function Border({
  position = "all",
  borderColor,
  borderWidth = 1,
  borderStyle = "line",
  children,
  ...rest
}: BorderProps) {
  const sides = resolveSides(position);
  const color = borderColor ? resolveColor(borderColor) : undefined;
  const chars = borderStyle === "dot" ? DOT_CHARS : LINE_CHARS;
  const depth = Math.max(1, Math.floor(borderWidth));

  // Build concentric border layers from the inside out.
  // The outermost layer receives the passthrough box props (width, height, etc.).
  // Inner layers are bare border wrappers.
  let content: ReactNode = <>{children}</>;

  for (let i = depth; i > 0; i--) {
    const isOuter = i === 1;
    content = (
      <box
        {...(isOuter ? rest : {})}
        border={sides}
        borderColor={color}
        customBorderChars={chars}
      >
        {content}
      </box>
    );
  }

  return content;
}
