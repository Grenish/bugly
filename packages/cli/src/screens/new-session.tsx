import { useEffect } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { useTheme } from "../providers/theme";
import { ErrorMessage } from "../components/chat/error-message";
import { UserMessage } from "../components/chat/user-message";
import { BotMessage } from "../components/chat/bot-message";
import { SessionShell } from "../components/session-shell";

export function NewSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme();

  const state = location.state as { message?: string } | null;

  useEffect(() => {
    if (!state?.message) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.message) return null;

  return (
    <SessionShell onSubmit={() => {}} inputDisabled loading>
      <UserMessage message={state.message} />
      <BotMessage content="Hello John, this code is bugged as hell." model="gemini-3.1-pro" />
      <ErrorMessage
        message="Something went wrong"
        description="something definitely went wrong on our side"
      />
    </SessionShell>
  );
}
