import "./env";
import { sentry } from "@sentry/hono/bun";
import * as Sentry from "@sentry/hono/bun";
import type { Hono } from "hono";

type LogContext = Record<string, unknown>;

const toNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value: string | undefined, fallback: boolean) => {
  if (!value) return fallback;

  return value === "true";
};

export const isSentryEnabled = Boolean(process.env.SENTRY_DSN);
export const isSentryDebugEnabled = process.env.SENTRY_DEBUG === "true";

export function sentryMiddleware(app: Hono) {
  return sentry(app, {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? "development",
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: toNumber(process.env.SENTRY_TRACES_SAMPLE_RATE, 0.1),
    enableLogs: toBoolean(process.env.SENTRY_ENABLE_LOGS, true),
    sendDefaultPii: toBoolean(process.env.SENTRY_SEND_DEFAULT_PII, false),
  });
}

export function captureException(error: unknown, context?: LogContext) {
  if (!isSentryEnabled) return;

  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext("request", context);
    }

    Sentry.captureException(error);
  });
}

export const logger = {
  info(message: string, context?: LogContext) {
    Sentry.logger.info(message, context);
  },
  warn(message: string, context?: LogContext) {
    Sentry.logger.warn(message, context);
  },
  error(message: string, context?: LogContext) {
    Sentry.logger.error(message, context);
  },
};

export { Sentry };
