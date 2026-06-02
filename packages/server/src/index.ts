import "./lib/env";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  captureException,
  isSentryDebugEnabled,
  logger,
  Sentry,
  sentryMiddleware,
} from "./lib/sentry";
import sessions from "./routes/session";

const app = new Hono();

app.use(sentryMiddleware(app));

if (isSentryDebugEnabled) {
  app.get("/debug-sentry", () => {
    logger.info("User triggered Sentry debug error", {
      action: "debug_sentry_endpoint",
    });

    Sentry.metrics.count("debug_sentry_counter", 1);
    throw new Error("Sentry debug error");
  });
}

app.onError((error, c) => {
  const requestContext = {
    path: c.req.path,
    method: c.req.method,
  };

  if (error instanceof HTTPException) {
    logger.warn("Handled HTTP error", {
      ...requestContext,
      status: error.status,
      message: error.message,
    });

    return c.json(
      {
        error: error.message || "Request failed",
      },
      error.status
    );
  }

  captureException(error, requestContext);
  logger.error("Unhandled server error", {
    ...requestContext,
    message: error instanceof Error ? error.message : String(error),
  });

  return c.json({ error: "Internal Server Error" }, 500);
});

app.get("/", (c) => {
  return c.body("Hello bugly");
});

app.get("/ping", (c) => {
  return c.body("really? fine. Pong");
});

const routes = app.route("/sessions", sessions);

export type AppType = typeof routes;

export default { port: 3000, fetch: app.fetch, idleTimeOut: 255 };
