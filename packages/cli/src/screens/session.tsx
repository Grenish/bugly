import { SessionShell } from "../components/session-shell";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import z from "zod";
import type { InferResponseType } from "hono/client";
import { UserMessage, BotMessage, ErrorMessage } from "../components/chat";
import { useToast } from "../providers/toast";
import { apiClient } from "../lib/api-client";
import { getErrorMessage } from "../lib/http-errors";

type SessionData = InferResponseType<(typeof apiClient.sessions)[":id"]["$get"], 200>;

const sessionLocationSchema = z.object({
  session: z.custom<SessionData>((val) => val != null && typeof val === "object" && "id" in val),
});

function ChatMessage({ msg }: { msg: SessionData["messages"][number] }) {
  if (msg.role === "user") {
    return <UserMessage message={msg.content} />;
  }

  if (msg.role === "error") {
    return <ErrorMessage message={msg.content} description="Something went wrong." />;
  }

  return <BotMessage content={msg.content} model={msg.model} />;
}

export function Session() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { show: showToast } = useToast();

  const prefetched = useMemo(() => {
    const parsed = sessionLocationSchema.safeParse(location.state);
    return parsed.success ? parsed.data.session : null;
  }, [location.state]);

  const [session, setSession] = useState<SessionData | null>(prefetched);

  useEffect(() => {
    if (prefetched) {
      setSession(prefetched);
      return;
    }

    setSession(null);

    if (!id) return;

    let ignore = false;
    const fetchSession = async () => {
      try {
        const res = await apiClient.sessions[":id"].$get({
          param: { id },
        });
        if (ignore) return;
        if (!res.ok) throw new Error(await getErrorMessage(res));
        setSession(await res.json());
      } catch (err) {
        if (ignore) return;
        showToast({ variant: "error", message: err instanceof Error ? err.message : String(err) });
        navigate("/", { replace: true });
      }
    };

    fetchSession();
    return () => {
      ignore = true;
    };
  }, [id, prefetched, showToast, navigate]);

  if (!session) {
    return <SessionShell onSubmit={() => {}} inputDisabled />;
  }

  return (
    <SessionShell onSubmit={() => {}} inputDisabled>
      {session.messages.map((message, index) => (
        <ChatMessage key={message.id} msg={message} />
      ))}
    </SessionShell>
  );
}
