import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import sessions from "./routes/session";

const app = new Hono();

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json(
      {
        error: error.message || "Request failed",
      },
      error.status
    );
  }

  console.error("Unhandled Server Error", error);
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
